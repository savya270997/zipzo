import { Product } from "../models/Product.js";
import { User } from "../models/User.js";

const sanitizeSeller = (seller) => {
  const plain = seller?.toObject ? seller.toObject() : seller;

  return {
    _id: plain._id,
    name: plain.name,
    email: plain.email,
    role: plain.role,
    accountStatus: plain.accountStatus || "active",
    adminNotes: plain.adminNotes || "",
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt
  };
};

const sanitizeAdminProduct = (product) => {
  const plain = product?.toObject ? product.toObject() : product;

  return {
    ...plain,
    seller:
      plain.seller && typeof plain.seller === "object"
        ? {
            _id: plain.seller._id,
            name: plain.seller.name,
            email: plain.seller.email,
            accountStatus: plain.seller.accountStatus || "active"
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

const buildSellerSummaries = (sellerDocs, products) =>
  sellerDocs.map((seller) => {
    const sellerProducts = products.filter((product) => `${product.seller?._id || product.seller}` === `${seller._id}`);
    const counts = sellerProducts.reduce(
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

    return {
      ...sanitizeSeller(seller),
      products: counts
    };
  });

const applyModerationToProduct = async (product, adminUserId, { approvalStatus, approvalNotes = "", isFeatured }) => {
  product.approvalStatus = approvalStatus;
  product.approvalNotes =
    approvalStatus === "approved"
      ? approvalNotes.trim() || "Approved by admin."
      : approvalStatus === "pending_approval"
        ? "Awaiting admin review."
        : approvalNotes.trim();
  product.reviewedBy = approvalStatus === "pending_approval" ? null : adminUserId;
  product.reviewedAt = approvalStatus === "pending_approval" ? null : new Date();

  if (typeof isFeatured === "boolean") {
    product.isFeatured = isFeatured;
  }

  await product.save();
};

export const getAdminDashboard = async (req, res) => {
  const [products, sellerDocs, customers] = await Promise.all([
    Product.find({ seller: { $ne: null } })
      .populate("seller", "name email accountStatus")
      .populate("reviewedBy", "name email")
      .sort({ updatedAt: -1 }),
    User.find({ role: "seller" }).select("name email role accountStatus adminNotes createdAt updatedAt"),
    User.countDocuments({ role: "customer" })
  ]);

  const sellers = buildSellerSummaries(sellerDocs, products);
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
      sellers: sellers.length,
      customers
    },
    products: products.map(sanitizeAdminProduct),
    sellers
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

  await applyModerationToProduct(product, req.user._id, { approvalStatus, approvalNotes, isFeatured });
  await product.populate("seller", "name email accountStatus");
  await product.populate("reviewedBy", "name email");

  res.json(sanitizeAdminProduct(product));
};

export const bulkReviewAdminProducts = async (req, res) => {
  const { productIds = [], approvalStatus, approvalNotes = "", isFeatured } = req.body;
  const allowedStatuses = ["approved", "rejected", "archived", "pending_approval"];

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: "Select at least one product" });
  }

  if (!allowedStatuses.includes(approvalStatus)) {
    return res.status(400).json({ message: "Invalid moderation status" });
  }

  if (approvalStatus === "rejected" && !approvalNotes.trim()) {
    return res.status(400).json({ message: "Please add a rejection note for the seller" });
  }

  const products = await Product.find({ _id: { $in: productIds }, seller: { $ne: null } });

  if (!products.length) {
    return res.status(404).json({ message: "No seller products found for bulk moderation" });
  }

  await Promise.all(
    products.map((product) =>
      applyModerationToProduct(product, req.user._id, { approvalStatus, approvalNotes, isFeatured })
    )
  );

  res.json({
    updatedCount: products.length,
    message: `${products.length} product${products.length > 1 ? "s" : ""} updated`
  });
};

export const updateAdminSeller = async (req, res) => {
  const { accountStatus, adminNotes = "" } = req.body;

  if (!["active", "suspended"].includes(accountStatus)) {
    return res.status(400).json({ message: "Invalid seller account status" });
  }

  const seller = await User.findOne({ _id: req.params.sellerId, role: "seller" });

  if (!seller) {
    return res.status(404).json({ message: "Seller not found" });
  }

  seller.accountStatus = accountStatus;
  seller.adminNotes = adminNotes.trim();
  await seller.save();

  res.json(sanitizeSeller(seller));
};
