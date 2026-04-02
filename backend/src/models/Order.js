import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    image: String,
    quantity: Number,
    weight: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    address: { type: Object, required: true },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], default: "razorpay" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: {
      type: String,
      enum: ["placed", "confirmed", "picked", "on_the_way", "delivered"],
      default: "placed"
    },
    timeline: [
      {
        status: String,
        label: String,
        timestamp: Date
      }
    ],
    scheduledSlot: String,
    subtotal: Number,
    deliveryFee: Number,
    discount: Number,
    loyaltyPointsEarned: Number,
    total: Number
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
