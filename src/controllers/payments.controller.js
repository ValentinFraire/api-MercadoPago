import dotenv from 'dotenv';
dotenv.config();
import { MercadoPagoConfig, Preference } from 'mercadopago';
import {prisma} from '../Lib/Prisma.js'

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

export const createOrder = async (req, res) => {
  try {
    const {
      nameUser,
      userId,
      date,
      companyName,
      folio,
      paidAmount,
      plans = [],
      services = [],
      items,
      notes = ""
    } = req.body;

    // Validación de items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items inválidos o vacíos' });
    }

    for (const item of items) {
      if (
        typeof item.title !== 'string' ||
        typeof item.unit_price !== 'number' ||
        typeof item.quantity !== 'number' ||
        item.unit_price <= 0 ||
        item.quantity <= 0
      ) {
        return res.status(400).json({ error: 'Item inválido detectado', item });
      }
    }

    // Calcular monto total
    const totalAmount = items.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    );

    // Configuración de métodos de pago
    const payment_methods = totalAmount > 10000
      ? {
          excluded_payment_types: [{ id: 'ticket' }, { id: 'atm' }],
          enabled_payment_types: [
            { id: 'bank_transfer' },
            { id: 'credit_card' },
            { id: 'debit_card' }
          ],
          excluded_payment_methods: [{ id: 'amex' }],
          installments: 3
        }
      : {
          excluded_payment_types: [{ id: 'atm' }],
          enabled_payment_types: [
            { id: 'credit_card' },
            { id: 'debit_card' },
            { id: 'ticket' },
            { id: 'bank_transfer' }
          ],
          installments: 6
        };

    // Crear preferencia en Mercado Pago
    const body = {
      items,
      back_urls: {
        success: `${process.env.BASE_URL}/api/payments/success`,
        failure: `${process.env.BASE_URL}/api/payments/failure`,
        pending: `${process.env.BASE_URL}/api/payments/pending`
      },
      
      notification_url: `${process.env.BASE_URL}/api/payments/webhook?token=${process.env.MP_WEBHOOK_TOKEN}`,
      auto_return: 'approved',
      payment_methods
    };

    const preference = await new Preference(client).create({ body });

    
    // Guardar en MongoDB vía Prisma
    const newPayment = await prisma.payment.create({
      data: {
        nameUser,
        userId,
        date,
        companyName,
        folio,
        plans,
        services,
        totalAmount,
        paidAmount,
        status: 'pending',
        notes,
        purchaseId: preference.id,
        items: {
          create: items.map((item) => ({
            title: item.title,
            unit_price: item.unit_price,
            description: item.description || '',
            quantity: item.quantity
          }))
        }
      }
    });
    // Enviar preferencia al cliente
    res.status(200).json({
      id: preference.id,
      init_point: preference.init_point,
      payment: newPayment
    });

  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({
      error: 'Error al crear la preferencia de pago',
      details: error.message
    });
  }
};
