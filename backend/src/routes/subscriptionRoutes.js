import express from "express";
import {
  createSubscription,
  getSubscriptions,
  updateSubscription
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getSubscriptions);
router.post("/", createSubscription);
router.patch("/:subscriptionId", updateSubscription);

export default router;
