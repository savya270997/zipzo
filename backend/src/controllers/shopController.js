import { partnerShops } from "../utils/partnerShops.js";

const normalizePostal = (code) => (code || "").toString().trim();

export const getNearbyShops = async (req, res) => {
  const addresses = req.user?.addresses || [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const postal = normalizePostal(defaultAddress?.postalCode);
  const city = (defaultAddress?.city || "").toLowerCase();

  let matches = partnerShops
    .filter(
      (shop) =>
        (postal && shop.postalCodes.map(normalizePostal).includes(postal)) ||
        (city && shop.city.toLowerCase() === city)
    )
    .sort((a, b) => b.rating - a.rating);

  if (matches.length === 0) {
    // Fallback: show top-rated shops overall so the UI is never empty
    matches = [...partnerShops].sort((a, b) => b.rating - a.rating);
  }

  res.json({
    addressLabel: defaultAddress?.label || "Any",
    postalCode: postal,
    city: defaultAddress?.city || "All cities",
    shops: matches.slice(0, 45)
  });
};
