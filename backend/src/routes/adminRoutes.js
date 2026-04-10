import express from "express";
import { getAdminDashboard, reviewAdminProduct } from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, requireRole("admin"));
router.get("/dashboard", getAdminDashboard);
router.patch("/products/:productId/review", reviewAdminProduct);

export default router;
