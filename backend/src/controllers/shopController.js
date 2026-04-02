import { partnerShops } from "../utils/partnerShops.js";

const normalizePostal = (code) => (code || "").toString().trim();

export const getNearbyShops = async (req, res) => {
  const addresses = req.user?.addresses || [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  if (!defaultAddress) {
    return res.status(400).json({ message: "Add an address to see nearby partners" });
  }

  const postal = normalizePostal(defaultAddress.postalCode);
  const city = (defaultAddress.city || "").toLowerCase();

  const matches = partnerShops
    .filter(
      (shop) =>
        shop.postalCodes.map(normalizePostal).includes(postal) ||
        shop.city.toLowerCase() === city
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  res.json({
    addressLabel: defaultAddress.label || "Default",
    postalCode: postal,
    city: defaultAddress.city,
    shops: matches
  });
};
