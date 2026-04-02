import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress
} from "../controllers/addressController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/", getAddresses);
router.post("/", addAddress);
router.patch("/:addressId", updateAddress);
router.delete("/:addressId", deleteAddress);

export default router;
