import express from "express";
import {
  bulkReviewAdminProducts,
  getAdminDashboard,
  reviewAdminProduct,
  updateAdminSeller
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRole("admin"));
router.get("/dashboard", getAdminDashboard);
router.post("/products/bulk-review", bulkReviewAdminProducts);
router.patch("/products/:productId/review", reviewAdminProduct);
router.patch("/sellers/:sellerId", updateAdminSeller);

export default router;
