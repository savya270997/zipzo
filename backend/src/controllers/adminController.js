import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const sanitizeAdminProduct = (product) => {
  const plain = product?.toObject ? product.toObject() : product;

  return {
    ...plain,
    seller:
      plain.seller && typeof plain.seller === "object"
        ? {
            _id: plain.seller._id,
            name: plain.seller.name,
            email: plain.seller.email
          }
        : plain.seller,
    images: plain.images?.length ? plain.images : plain.image ? [plain.image] : [],
    reviewedBy:
      plain.reviewedBy && typeof plain.reviewedBy === "object"
        ? {
            _id: plain.reviewedBy._id,
            name: plain.reviewedBy.name,
            email: plain.reviewedBy.email
          }
        : plain.reviewedBy
  };
};

export const getAdminDashboard = async (req, res) => {
  const [products, sellers, customers] = await Promise.all([
    Product.find({ seller: { $ne: null } })
      .populate("seller", "name email")
      .populate("reviewedBy", "name email")
      .sort({ updatedAt: -1 }),
    User.countDocuments({ role: "seller" }),
    User.countDocuments({ role: "customer" })
  ]);

  const stats = products.reduce(
    (acc, product) => {
      acc.total += 1;
      acc[product.approvalStatus] = (acc[product.approvalStatus] || 0) + 1;
      return acc;
    },
    {
      total: 0,
      draft: 0,
      pending_approval: 0,
      approved: 0,
      rejected: 0,
      archived: 0
    }
  );

  res.json({
    stats: {
      ...stats,
      sellers,
      customers
    },
    products: products.map(sanitizeAdminProduct)
  });
};

export const reviewAdminProduct = async (req, res) => {
  const { approvalStatus, approvalNotes = "", isFeatured } = req.body;
  const allowedStatuses = ["approved", "rejected", "archived", "pending_approval"];

  if (!allowedStatuses.includes(approvalStatus)) {
    return res.status(400).json({ message: "Invalid moderation status" });
  }

  if (approvalStatus === "rejected" && !approvalNotes.trim()) {
    return res.status(400).json({ message: "Please add a rejection note for the seller" });
  }

  const product = await Product.findOne({ _id: req.params.productId, seller: { $ne: null } });

  if (!product) {
    return res.status(404).json({ message: "Seller product not found" });
  }

  product.approvalStatus = approvalStatus;
  product.approvalNotes =
    approvalStatus === "approved"
      ? approvalNotes.trim() || "Approved by admin."
      : approvalStatus === "pending_approval"
        ? "Awaiting admin review."
        : approvalNotes.trim();
  product.reviewedBy = req.user._id;
  product.reviewedAt = new Date();

  if (typeof isFeatured === "boolean") {
    product.isFeatured = isFeatured;
  }

  await product.save();
  await product.populate("seller", "name email");
  await product.populate("reviewedBy", "name email");

  res.json(sanitizeAdminProduct(product));
};
