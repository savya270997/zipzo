import express from "express";
import {
  createSellerProduct,
  deleteSellerProduct,
  getSellerDashboard,
  updateSellerProduct
} from "../controllers/sellerController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRole("seller"));
router.get("/dashboard", getSellerDashboard);
router.post("/products", createSellerProduct);
router.patch("/products/:productId", updateSellerProduct);
router.delete("/products/:productId", deleteSellerProduct);

export default router;
