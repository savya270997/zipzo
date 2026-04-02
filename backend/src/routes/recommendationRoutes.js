import express from "express";
import { getRecommendations, getRewards } from "../controllers/recommendationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getRecommendations);
router.get("/rewards", getRewards);

export default router;
