import { Product } from "../models/Product.js";
import { partnerShops } from "../utils/partnerShops.js";
import { catalogProducts } from "../utils/catalogData.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";
import { decorateProductsWithMarketplace, getProductsForShop } from "../utils/marketplaceData.js";

const normalizePostal = (code) => (code || "").toString().trim();

const loadCatalog = async () => {
  if (isFirebaseMode()) {
    return firebaseStore.getProducts();
  }

  if (process.env.DEMO_MODE !== "true") {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return products.map((product) => (product.toObject ? product.toObject() : product));
  }

  return catalogProducts;
};

export const getNearbyShops = async (req, res) => {
  const addresses = req.user?.addresses || [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  // For now, ignore geo-filtering and serve the top-rated set so users always see shops
  const products = await loadCatalog();
  const decorated = decorateProductsWithMarketplace(products);
  const counts = decorated.reduce((map, product) => {
    map.set(product.shop.id, (map.get(product.shop.id) || 0) + 1);
    return map;
  }, new Map());

  const shops = [...partnerShops]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 45)
    .map((shop) => ({
      ...shop,
      productCount: counts.get(shop.id) || 0
    }));

  res.json({
    addressLabel: defaultAddress?.label || "Any",
    postalCode: normalizePostal(defaultAddress?.postalCode),
    city: defaultAddress?.city || "All cities",
    shops
  });
};

export const getShopById = async (req, res) => {
  const shop = partnerShops.find((item) => item.id === req.params.shopId);

  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  const products = await loadCatalog();
  const listedProducts = getProductsForShop(products, shop.id);

  res.json({
    ...shop,
    productCount: listedProducts.length,
    products: listedProducts
  });
};
