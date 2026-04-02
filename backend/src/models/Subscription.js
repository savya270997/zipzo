import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily"
    },
    preferredSlot: String,
    nextDeliveryDate: Date,
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
