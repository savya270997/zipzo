import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    landmark: { type: String, default: "" },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const purchasePreferenceSchema = new mongoose.Schema(
  {
    category: String,
    brand: String,
    score: { type: Number, default: 1 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
    accountStatus: { type: String, enum: ["active", "suspended"], default: "active" },
    adminNotes: { type: String, default: "" },
    loyaltyPoints: { type: Number, default: 0 },
    addresses: [addressSchema],
    purchasePreferences: [purchasePreferenceSchema]
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
