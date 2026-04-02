const baseSeeds = [
  {
    id: "shop-green-basket",
    name: "Green Basket Mart",
    city: "Bangalore",
    postalCodes: ["560001", "560008", "560017"],
    rating: 4.6,
    etaMinutes: 20,
    since: 2019,
    tags: ["Fresh produce", "Organic"],
    offer: "Save ₹30 on tomorrow slots"
  },
  {
    id: "shop-quick-dairy",
    name: "Quick Dairy & Essentials",
    city: "Bangalore",
    postalCodes: ["560034", "560076", "560095"],
    rating: 4.4,
    etaMinutes: 15,
    since: 2020,
    tags: ["Dairy", "Bakery"],
    offer: "Buy 2 get 1 on breads"
  },
  {
    id: "shop-hyperlocal",
    name: "Hyperlocal Hub",
    city: "Hyderabad",
    postalCodes: ["500001", "500032", "500081"],
    rating: 4.5,
    etaMinutes: 18,
    since: 2018,
    tags: ["Snacks", "Beverages"],
    offer: "Flat 10% off above ₹499"
  },
  {
    id: "shop-urban-greens",
    name: "Urban Greens",
    city: "Mumbai",
    postalCodes: ["400001", "400021", "400051"],
    rating: 4.7,
    etaMinutes: 22,
    since: 2017,
    tags: ["Veggies", "Fruits"],
    offer: "Free delivery this week"
  },
  {
    id: "shop-midnight",
    name: "Midnight Essentials",
    city: "Mumbai",
    postalCodes: ["400050", "400067"],
    rating: 4.2,
    etaMinutes: 25,
    since: 2021,
    tags: ["24x7", "Quick bites"],
    offer: "₹40 off above ₹299"
  }
];

export const demoShop = {
  id: "shop-demo-zipzo",
  name: "Zipzo Demo Store",
  city: "Hyderabad",
  postalCodes: ["500001", "500032", "500081"],
  rating: 4.9,
  etaMinutes: 14,
  since: 2024,
  tags: ["Curated picks", "Fast movers", "Multi-category"],
  offer: "Demo store deals live now"
};

export const partnerShops = [
  demoShop,
  ...Array.from({ length: 45 }, (_, i) => {
  const seed = baseSeeds[i % baseSeeds.length];
  const ratingTweak = Number((seed.rating - (i % 3) * 0.05).toFixed(1));
  return {
    ...seed,
    id: `${seed.id}-${i + 1}`,
    name: `${seed.name} #${i + 1}`,
    rating: ratingTweak < 3.8 ? 3.8 : ratingTweak,
    etaMinutes: seed.etaMinutes + (i % 5) * 2,
    since: seed.since - (i % 4),
    tags: seed.tags,
    offer: seed.offer
  };
})
];
