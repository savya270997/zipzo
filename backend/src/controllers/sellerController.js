import { Product } from "../models/Product.js";

const SELLER_IMAGE_FALLBACK = "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80";

const normalizeImages = (images = [], image = "") => {
  const merged = [...images, image]
    .flatMap((item) => (Array.isArray(item) ? item : [item]))
    .map((item) => `${item || ""}`.trim())
    .filter(Boolean);

  return [...new Set(merged)];
};

const normalizeTags = (tags = []) =>
  (Array.isArray(tags) ? tags : `${tags}`.split(","))
    .map((tag) => `${tag || ""}`.trim())
    .filter(Boolean);

const buildUploadUrl = (req, relativePath) => `${req.protocol}://${req.get("host")}${relativePath}`;

const sanitizeSellerProduct = (product) => {
  const plain = product?.toObject ? product.toObject() : product;

  return {
    ...plain,
    seller: plain.seller?._id || plain.seller,
    images: plain.images?.length ? plain.images : plain.image ? [plain.image] : []
  };
};

const validateProductInput = (payload) => {
  const requiredText = ["name", "description", "category", "brand", "weight"];

  for (const field of requiredText) {
    if (!payload[field]?.trim()) {
      return `${field} is required`;
    }
  }

  if (!Number.isFinite(Number(payload.price)) || Number(payload.price) <= 0) {
    return "Price must be greater than 0";
  }

  if (!Number.isFinite(Number(payload.mrp)) || Number(payload.mrp) <= 0) {
    return "MRP must be greater than 0";
  }

  if (Number(payload.mrp) < Number(payload.price)) {
    return "MRP should be greater than or equal to price";
  }

  if (!Number.isFinite(Number(payload.stock)) || Number(payload.stock) < 0) {
    return "Stock cannot be negative";
  }

  return null;
};

export const uploadSellerImages = async (req, res) => {
  const files = (req.files || []).map((file) => ({
    name: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    url: buildUploadUrl(req, `/uploads/seller-products/${file.filename}`)
  }));

  res.status(201).json({ files });
};

export const getSellerDashboard = async (req, res) => {
  const sellerId = req.user._id;
  const sellerProducts = await Product.find({ seller: sellerId }).sort({ updatedAt: -1 });

  const stats = sellerProducts.reduce(
    (acc, product) => {
      acc.total += 1;
      acc[product.approvalStatus] = (acc[product.approvalStatus] || 0) + 1;
      acc.inventoryValue += Number(product.price || 0) * Number(product.stock || 0);
      return acc;
    },
    {
      total: 0,
      draft: 0,
      pending_approval: 0,
      approved: 0,
      rejected: 0,
      archived: 0,
      inventoryValue: 0
    }
  );

  res.json({
    stats,
    products: sellerProducts.map(sanitizeSellerProduct)
  });
};

export const createSellerProduct = async (req, res) => {
  const validationError = validateProductInput(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const images = normalizeImages(req.body.images, req.body.image);
  const product = await Product.create({
    ...req.body,
    seller: req.user._id,
    sellerName: req.user.name,
    shopName: req.body.shopName?.trim() || `${req.user.name}'s Store`,
    sku: req.body.sku?.trim() || `ZIP-${Date.now().toString().slice(-6)}`,
    price: Number(req.body.price),
    mrp: Number(req.body.mrp),
    stock: Number(req.body.stock),
    tags: normalizeTags(req.body.tags),
    images,
    image: images[0] || SELLER_IMAGE_FALLBACK,
    approvalStatus: req.body.approvalStatus || "draft",
    approvalNotes: req.body.approvalStatus === "pending_approval" ? "Awaiting admin review." : "",
    reviewedBy: null,
    reviewedAt: null
  });

  res.status(201).json(sanitizeSellerProduct(product));
};

export const updateSellerProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId, seller: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Seller product not found" });
  }

  const nextPayload = {
    ...product.toObject(),
    ...req.body
  };

  const validationError = validateProductInput(nextPayload);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const images = normalizeImages(req.body.images ?? product.images, req.body.image ?? product.image);

  Object.assign(product, {
    ...req.body,
    shopName: req.body.shopName?.trim() || product.shopName || `${req.user.name}'s Store`,
    sku: req.body.sku?.trim() || product.sku,
    price: Number(nextPayload.price),
    mrp: Number(nextPayload.mrp),
    stock: Number(nextPayload.stock),
    tags: normalizeTags(req.body.tags ?? product.tags),
    images,
    image: images[0] || product.image || SELLER_IMAGE_FALLBACK
  });

  if (req.body.approvalStatus === "pending_approval") {
    product.approvalNotes = "Awaiting admin review.";
    product.reviewedBy = null;
    product.reviewedAt = null;
  }

  await product.save();
  res.json(sanitizeSellerProduct(product));
};

export const deleteSellerProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId, seller: req.user._id });

  if (!product) {
    return res.status(404).json({ message: "Seller product not found" });
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
};
