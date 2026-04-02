import express from "express";
import { getNearbyShops } from "../controllers/shopController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/nearby", getNearbyShops);

export default router;
