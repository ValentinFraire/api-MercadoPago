import express from "express";
import { createOrder } from "../controllers/payments.controller.js";
import { handleWebhook } from "../controllers/WebHook.controller.js";
import {
  getAllPayments,
  getPaymentsByUserId
} from "../controllers/PaymentAxioscontroler.js";
const router = express.Router();

router.post("/create-order", createOrder);
router.get("/success", (req, res) => {
  res.send("Pago exitoso");
});
router.get("/failure", (req, res) => {
  res.send("Pago fallido o cancelado");
});
router.get("/pending", (req, res) => {
  res.send("Pago pendiente");
});
router.post("/webhook", handleWebhook);
router.get("/pagos/:clienteId", getPaymentsByUserId);
router.get("/pagos", getAllPayments);

export default router;
