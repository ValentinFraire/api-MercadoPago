import { prisma } from "../Lib/Prisma.js";

// Obtener todos los pagos ordenados por fecha descendente
export const getAllPayments = async (req, res) => {
  try {
    const pagos = await prisma.payment.findMany({
      orderBy: { date: "desc" },
      include: {
        items: true // Incluye los items relacionados si los necesitas
      }
    });

    res.json(pagos);
  } catch (error) {
    console.error("❌ Error al obtener pagos:", error);
    res.status(500).json({ error: "Error al obtener pagos", details: error.message });
  }
};

// Obtener pagos por ID de usuario
export const getPaymentsByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Falta el parámetro userId" });
  }

  try {
    const pagos = await prisma.payment.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      include: {
        items: true
      }
    });

    res.json(pagos);
  } catch (error) {
    console.error("❌ Error al obtener pagos del usuario:", error);
    res.status(500).json({ error: "Error al obtener pagos del usuario", details: error.message });
  }
};
