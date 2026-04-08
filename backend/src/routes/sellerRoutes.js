import express from "express";
import {
  createSellerProduct,
  deleteSellerProduct,
  getSellerDashboard,
  uploadSellerImages,
  updateSellerProduct
} from "../controllers/sellerController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { sellerUpload } from "../middleware/sellerUpload.js";

const router = express.Router();

router.use(protect, requireRole("seller"));
router.get("/dashboard", getSellerDashboard);
router.post("/uploads", sellerUpload.array("images", 6), uploadSellerImages);
router.post("/products", createSellerProduct);
router.patch("/products/:productId", updateSellerProduct);
router.delete("/products/:productId", deleteSellerProduct);

export default router;
