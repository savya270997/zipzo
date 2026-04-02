import { partnerShops } from "./partnerShops.js";

const hashValue = (value = "") =>
  value.split("").reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);

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
  const primaryIndex = hashValue(product._id || product.name) % partnerShops.length;
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
