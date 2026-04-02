import { Product } from "../models/Product.js";
import { catalogProducts } from "../utils/catalogData.js";
import { firebaseStore } from "../utils/firestoreStore.js";
import { isFirebaseMode } from "../config/firebase.js";
import { decorateProductWithMarketplace, decorateProductsWithMarketplace } from "../utils/marketplaceData.js";

const isDemoMode = () => process.env.DEMO_MODE === "true";
const toPlainProduct = (product) => (product?.toObject ? product.toObject() : product);

const filterCatalog = (products, query) => {
  const { search, category, brand, minPrice, maxPrice, featured } = query;

  return products.filter((product) => {
    const matchesSearch =
      !search ||
      [product.name, product.brand, product.category].some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCategory = !category || product.category === category;
    const matchesBrand = !brand || product.brand === brand;
    const matchesFeatured = featured !== "true" || product.isFeatured;
    const matchesMinPrice = !minPrice || product.price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || product.price <= Number(maxPrice);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesFeatured &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });
};

export const getProducts = async (req, res) => {
  if (isFirebaseMode()) {
    const allProducts = await firebaseStore.getProducts();
    const products = decorateProductsWithMarketplace(filterCatalog(allProducts, req.query));
    const categories = [...new Set(allProducts.map((product) => product.category))];
    const brands = [...new Set(allProducts.map((product) => product.brand))];

    return res.json({ products, filters: { categories, brands } });
  }

  if (isDemoMode()) {
    const products = decorateProductsWithMarketplace(filterCatalog(catalogProducts, req.query));
    const categories = [...new Set(catalogProducts.map((product) => product.category))];
    const brands = [...new Set(catalogProducts.map((product) => product.brand))];

    return res.json({ products, filters: { categories, brands } });
  }

  const { search, category, brand, minPrice, maxPrice, featured } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } }
    ];
  }
  if (category) query.category = category;
  if (brand) query.brand = brand;
  if (featured === "true") query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query).sort({ createdAt: -1 });
  const categories = await Product.distinct("category");
  const brands = await Product.distinct("brand");

  res.json({ products: decorateProductsWithMarketplace(products.map(toPlainProduct)), filters: { categories, brands } });
};

export const getProductById = async (req, res) => {
  if (isFirebaseMode()) {
    const product = await firebaseStore.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(decorateProductWithMarketplace(product));
  }

  if (isDemoMode()) {
    const product = catalogProducts.find((item) => item._id === req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(decorateProductWithMarketplace(product));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(decorateProductWithMarketplace(product.toObject ? product.toObject() : product));
};

export const getFeaturedProducts = async (_req, res) => {
  if (isFirebaseMode()) {
    const products = await firebaseStore.getProducts();
    return res.json(decorateProductsWithMarketplace(products.filter((product) => product.isFeatured).slice(0, 12)));
  }

  if (isDemoMode()) {
    return res.json(decorateProductsWithMarketplace(catalogProducts.filter((product) => product.isFeatured).slice(0, 12)));
  }

  const products = await Product.find({ isFeatured: true }).limit(8);
  res.json(decorateProductsWithMarketplace(products.map((product) => (product.toObject ? product.toObject() : product))));
};
