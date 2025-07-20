import { MercadoPagoConfig } from "mercadopago";
import { prisma } from "../Lib/prisma.js";

const mp = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

export const handleWebhook = async (req, res) => {
  const token = req.query.token;

  if (token !== process.env.MP_WEBHOOK_TOKEN) {
    return res.sendStatus(401); // Unauthorized
  }

  const { type, data } = req.body;

  if (!type || !data?.id) {
    return res.sendStatus(400); // Bad Request
  }

  try {
    if (type === "payment") {
      const { body: payment } = await mp.payment.findById(data.id);

      console.log("🔔 Pago recibido:", {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        payer: payment.payer?.email,
        transaction_amount: payment.transaction_amount,
        preference_id: payment.preference_id,
      });

      // ✅ Actualizar el modelo Payment
      const updated = await prisma.payment.updateMany({
        where: { purchaseId: payment.preference_id },
        data: { status: payment.status },
      });

      console.log("✅ Registro actualizado:", updated);

      return res.sendStatus(200);
    } else {
      console.log("📬 Tipo de notificación no manejado:", type);
      return res.sendStatus(200);
    }
  } catch (error) {
    console.error("❌ Error al procesar el webhook:", error);
    return res.sendStatus(500);
  }
};
