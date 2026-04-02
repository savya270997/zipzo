import { partnerShops } from "./partnerShops.js";

const DEMO_SHOP_ID = "shop-demo-zipzo";
const DEMO_PRODUCT_IDS = new Set([
  "demo-product-14-1",
  "demo-product-14-4",
  "demo-product-15-1",
  "demo-product-16-2",
  "demo-product-17-3",
  "demo-product-18-1",
  "demo-product-19-2",
  "demo-product-20-1"
]);

const hashValue = (value = "") =>
  String(value ?? "")
    .split("")
    .reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);

const buildComparisons = (product, primaryIndex) => {
  return Array.from({ length: 3 }, (_, offset) => {
    const shop = partnerShops[(primaryIndex + offset) % partnerShops.length];
    const priceDelta = offset === 0 ? 0 : offset === 1 ? 18 : -12;

    return {
      shopId: shop.id,
      shopName: shop.name,
      price: Math.max(product.price + priceDelta, 1),
      deliveryEta: `${shop.etaMinutes + offset * 3} mins`,
      rating: shop.rating
    };
  }).sort((a, b) => a.price - b.price);
};

export const decorateProductWithMarketplace = (product) => {
  const remainingShops = partnerShops.filter((shop) => shop.id !== DEMO_SHOP_ID);
  const productId = String(product?._id ?? "");
  const isDemoProduct = DEMO_PRODUCT_IDS.has(productId);
  const primaryIndex = isDemoProduct
    ? 0
    : (hashValue(productId || product.name) % remainingShops.length) + 1;
  const shop = partnerShops[primaryIndex];
  const sellerComparisons = buildComparisons(product, primaryIndex);
  const primaryComparison = sellerComparisons.find((item) => item.shopId === shop.id) || sellerComparisons[0];

  return {
    ...product,
    shop: {
      id: shop.id,
      name: shop.name,
      city: shop.city,
      rating: shop.rating,
      etaMinutes: shop.etaMinutes,
      since: shop.since,
      tags: shop.tags,
      offer: shop.offer
    },
    sellerComparisons,
    priceComparisons: sellerComparisons.map((item) => ({
      store: item.shopName,
      price: item.price,
      deliveryEta: item.deliveryEta
    })),
    price: primaryComparison.price
  };
};

export const decorateProductsWithMarketplace = (products = []) =>
  products.map((product) => decorateProductWithMarketplace(product));

export const getProductsForShop = (products = [], shopId) =>
  decorateProductsWithMarketplace(products).filter((product) => product.shop?.id === shopId);
