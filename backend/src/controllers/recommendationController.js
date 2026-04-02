import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { catalogProducts } from "../utils/catalogData.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";

const isDemoMode = () => process.env.DEMO_MODE === "true";

export const getRecommendations = async (req, res) => {
  if (isFirebaseMode()) {
    const user = await firebaseStore.findUserById(req.user._id);
    const products = await firebaseStore.getProducts();
    const preferredCategories = (user.purchasePreferences || [])
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.category);

    const recommendations =
      preferredCategories.length > 0
        ? products.filter((product) => preferredCategories.includes(product.category)).slice(0, 8)
        : products.filter((product) => product.isFeatured).slice(0, 8);

    return res.json(recommendations);
  }

  if (isDemoMode()) {
    return res.json(catalogProducts.filter((product) => product.isFeatured).slice(0, 8));
  }

  const user = await User.findById(req.user._id);
  const preferredCategories = user.purchasePreferences
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.category);

  const recommendations =
    preferredCategories.length > 0
      ? await Product.find({
          category: { $in: preferredCategories },
          stock: { $gt: 0 }
        }).limit(8)
      : await Product.find({ isFeatured: true }).limit(8);

  res.json(recommendations);
};

export const getRewards = async (req, res) => {
  if (isFirebaseMode()) {
    const user = await firebaseStore.findUserById(req.user._id);
    return res.json({
      loyaltyPoints: user.loyaltyPoints || 0,
      nextRewardAt: Math.ceil(((user.loyaltyPoints || 0) + 1) / 100) * 100
    });
  }

  if (isDemoMode()) {
    return res.json({
      loyaltyPoints: req.user.loyaltyPoints || 120,
      nextRewardAt: 200
    });
  }

  const user = await User.findById(req.user._id).select("loyaltyPoints");
  res.json({
    loyaltyPoints: user.loyaltyPoints,
    nextRewardAt: Math.ceil((user.loyaltyPoints + 1) / 100) * 100
  });
};
