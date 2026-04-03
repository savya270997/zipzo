import mongoose from "mongoose";

const comparisonSchema = new mongoose.Schema(
  {
    store: String,
    price: Number,
    deliveryEta: String
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    sellerName: { type: String, default: "" },
    shopName: { type: String, default: "" },
    sku: { type: String, default: "" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    rating: { type: Number, default: 4.2 },
    isFeatured: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "rejected", "archived"],
      default: "approved"
    },
    approvalNotes: { type: String, default: "" },
    tags: [{ type: String }],
    priceComparisons: [comparisonSchema]
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
