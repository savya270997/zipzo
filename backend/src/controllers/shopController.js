import { partnerShops } from "../utils/partnerShops.js";

const normalizePostal = (code) => (code || "").toString().trim();

export const getNearbyShops = async (req, res) => {
  const addresses = req.user?.addresses || [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  // For now, ignore geo-filtering and serve the top-rated set so users always see shops
  const shops = [...partnerShops].sort((a, b) => b.rating - a.rating).slice(0, 45);

  res.json({
    addressLabel: defaultAddress?.label || "Any",
    postalCode: normalizePostal(defaultAddress?.postalCode),
    city: defaultAddress?.city || "All cities",
    shops
  });
};
