import express from "express";
import {
  createPaymentOrder,
  getOrders,
  getOrderTracking,
  placeOrder
} from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/payment-order", createPaymentOrder);
router.post("/", placeOrder);
router.get("/", getOrders);
router.get("/:orderId/tracking", getOrderTracking);

export default router;
