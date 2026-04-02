const stores = ["Instamart", "Zepto", "BigBasket"];

const categoryConfigs = [
  {
    category: "Fruits",
    brand: "FreshNest",
    baseWeight: "1 kg",
    priceStart: 52,
    tags: ["fresh", "fruit"],
    imageQuery: "fruits,grocery",
    items: [
      ["Royal Banana", "Naturally ripened bananas packed for daily energy."],
      ["Shimla Apple", "Crisp apples with balanced sweetness and crunch."],
      ["Nagpur Orange", "Juicy oranges rich in vitamin C."],
      ["Seedless Grapes", "Easy-to-eat green grapes for snacks and lunch boxes."],
      ["Pomegranate", "Ruby red pomegranates with premium juicy pearls."]
    ]
  },
  {
    category: "Vegetables",
    brand: "GreenKart",
    baseWeight: "500 g",
    priceStart: 28,
    tags: ["farm", "vegetable"],
    imageQuery: "vegetables,market",
    items: [
      ["Premium Tomato", "Juicy tomatoes for gravies, salads, and chutneys."],
      ["Fresh Potato", "All-purpose potatoes for fries, sabzi, and curries."],
      ["Onion Value Pack", "Kitchen staple onions with firm texture."],
      ["Capsicum Green", "Crisp capsicum for stir-fries and noodles."],
      ["Baby Spinach", "Tender spinach leaves ideal for saag and smoothies."]
    ]
  },
  {
    category: "Dairy",
    brand: "Amul",
    baseWeight: "1 L",
    priceStart: 42,
    tags: ["breakfast", "daily"],
    imageQuery: "dairy,milk",
    items: [
      ["Full Cream Milk", "Rich milk for tea, coffee, cereals, and desserts."],
      ["Plain Curd", "Thick curd with fresh homemade taste."],
      ["Salted Butter", "Creamy butter for toast, parathas, and baking."],
      ["Paneer Cubes", "Soft paneer for quick gravies and snacks."],
      ["Greek Yogurt", "Protein-rich yogurt with smooth texture."]
    ]
  },
  {
    category: "Bakery",
    brand: "Harvest Gold",
    baseWeight: "400 g",
    priceStart: 35,
    tags: ["bread", "morning"],
    imageQuery: "bakery,bread",
    items: [
      ["Whole Wheat Bread", "Soft sliced bread for breakfast and sandwiches."],
      ["Burger Buns", "Fluffy buns ready for homemade burgers."],
      ["Garlic Bread", "Toasted garlic bread with buttery flavor."],
      ["Multigrain Loaf", "Healthy multigrain loaf with seeded crust."],
      ["Chocolate Muffin", "Moist muffin with rich chocolate center."]
    ]
  },
  {
    category: "Beverages",
    brand: "Paper Boat",
    baseWeight: "750 ml",
    priceStart: 58,
    tags: ["drink", "refreshing"],
    imageQuery: "beverages,drink",
    items: [
      ["Sparkling Lemonade", "Refreshing fizzy drink for hot afternoons."],
      ["Mango Drink", "Summer-style mango beverage served chilled."],
      ["Tender Coconut Water", "Hydrating coconut water with light sweetness."],
      ["Cold Coffee", "Cafe-style cold coffee in ready-to-drink format."],
      ["Orange Juice", "Fruit-forward juice for breakfast and brunch."]
    ]
  },
  {
    category: "Snacks",
    brand: "Too Yumm",
    baseWeight: "150 g",
    priceStart: 30,
    tags: ["snack", "crunchy"],
    imageQuery: "snacks,food",
    items: [
      ["Cheesy Nachos", "Crunchy nachos with bold cheese seasoning."],
      ["Masala Chips", "Classic potato chips with masala spice blend."],
      ["Roasted Makhana", "Light roasted fox nuts for healthy snacking."],
      ["Salted Peanuts", "Roasted peanuts for tea-time cravings."],
      ["Trail Mix", "Fruit and nut mix for quick energy."]
    ]
  },
  {
    category: "Frozen Foods",
    brand: "ITC Master Chef",
    baseWeight: "500 g",
    priceStart: 88,
    tags: ["frozen", "quick"],
    imageQuery: "frozen,food",
    items: [
      ["Frozen Green Peas", "Sweet frozen peas for pulao and curries."],
      ["Veg Momos", "Steamed-style dumplings for fast snacks."],
      ["Aloo Tikki Patty", "Crispy tikkis for burgers and wraps."],
      ["French Fries", "Golden fries ready for air fry or deep fry."],
      ["Frozen Corn", "Sweet corn kernels for soups and salads."]
    ]
  },
  {
    category: "Breakfast",
    brand: "Kellogg's",
    baseWeight: "350 g",
    priceStart: 70,
    tags: ["breakfast", "cereal"],
    imageQuery: "breakfast,cereal",
    items: [
      ["Corn Flakes", "Classic breakfast cereal with crisp flakes."],
      ["Chocolate Muesli", "Crunchy muesli with dark chocolate bites."],
      ["Oats Jar", "Rolled oats for porridge and smoothies."],
      ["Peanut Butter", "Smooth peanut butter for toast and shakes."],
      ["Instant Poha Cup", "Ready breakfast cup with Indian flavors."]
    ]
  },
  {
    category: "Personal Care",
    brand: "Dove",
    baseWeight: "250 ml",
    priceStart: 95,
    tags: ["care", "daily"],
    imageQuery: "personalcare,products",
    items: [
      ["Shower Gel", "Moisturizing body wash with soft fragrance."],
      ["Shampoo", "Daily care shampoo for smooth hair."],
      ["Face Wash", "Gentle cleanser for everyday freshness."],
      ["Body Lotion", "Hydrating lotion for long-lasting moisture."],
      ["Deodorant Spray", "Freshness spray with clean finish."]
    ]
  },
  {
    category: "Household",
    brand: "Surf Excel",
    baseWeight: "1 kg",
    priceStart: 85,
    tags: ["home", "cleaning"],
    imageQuery: "household,cleaning",
    items: [
      ["Detergent Powder", "Stain-fighting detergent for daily laundry."],
      ["Dishwash Gel", "Grease-cutting gel for utensils and cookware."],
      ["Floor Cleaner", "Fragrant disinfecting floor cleaner."],
      ["Kitchen Towels", "Absorbent towels for everyday kitchen use."],
      ["Garbage Bags", "Strong bags for wet and dry waste."]
    ]
  },
  {
    category: "Baby Care",
    brand: "Himalaya Baby",
    baseWeight: "400 g",
    priceStart: 120,
    tags: ["baby", "gentle"],
    imageQuery: "baby,care",
    items: [
      ["Baby Diapers", "Leak-lock diapers for all-night comfort."],
      ["Baby Wipes", "Soft wipes enriched with aloe vera."],
      ["Baby Lotion", "Mild lotion for delicate skin."],
      ["Baby Soap", "Gentle cleansing bar for infants."],
      ["Baby Powder", "Soft powder for dry and fresh skin."]
    ]
  },
  {
    category: "Pet Care",
    brand: "Drools",
    baseWeight: "1 kg",
    priceStart: 140,
    tags: ["pet", "care"],
    imageQuery: "pet,food",
    items: [
      ["Dog Food Adult", "Balanced nutrition for adult dogs."],
      ["Cat Food Tuna", "Tuna-flavored cat food for daily meals."],
      ["Dog Treat Biscuits", "Crunchy treats for training and rewards."],
      ["Cat Litter", "Odor-control litter for clean homes."],
      ["Pet Shampoo", "Mild shampoo for a shiny pet coat."]
    ]
  },
  {
    category: "Organic",
    brand: "24 Mantra",
    baseWeight: "1 kg",
    priceStart: 95,
    tags: ["organic", "healthy"],
    imageQuery: "organic,grocery",
    items: [
      ["Organic Brown Rice", "Wholesome brown rice for daily meals."],
      ["Organic Tur Dal", "Chemical-free dal with clean taste."],
      ["Organic Jaggery", "Unrefined jaggery with natural sweetness."],
      ["Organic Besan", "Fresh gram flour for pakoras and cheela."],
      ["Organic Ghee", "Aromatic ghee made from quality milk."]
    ]
  },
  {
    category: "Instant Food",
    brand: "Maggi",
    baseWeight: "280 g",
    priceStart: 42,
    tags: ["instant", "quickmeal"],
    imageQuery: "instant,noodles",
    items: [
      ["Masala Noodles", "Classic instant noodles with masala tastemaker."],
      ["Cup Pasta", "Microwave-friendly cup pasta for quick hunger."],
      ["Ready Upma", "Instant upma mix for easy breakfasts."],
      ["Soup Sachet", "Hot instant soup for evening cravings."],
      ["Ready Khichdi", "Comfort meal ready in minutes."]
    ]
  },
  {
    category: "Dry Fruits",
    brand: "NutriBox",
    baseWeight: "200 g",
    priceStart: 160,
    tags: ["nuts", "premium"],
    imageQuery: "dryfruits,nuts",
    items: [
      ["Premium Almonds", "Crunchy almonds packed with nutrients."],
      ["Salted Pistachios", "Roasted pistachios with light seasoning."],
      ["Whole Cashews", "Creamy cashews for snacks and curries."],
      ["Raisins Gold", "Naturally sweet raisins for desserts."],
      ["Dates Deluxe", "Soft dates ideal for fasting and snacking."]
    ]
  },
  {
    category: "Meat & Seafood",
    brand: "FreshCatch",
    baseWeight: "500 g",
    priceStart: 190,
    tags: ["protein", "fresh"],
    imageQuery: "meat,seafood",
    items: [
      ["Chicken Breast", "Trimmed chicken breast for curries and grills."],
      ["Chicken Curry Cut", "Fresh-cut chicken for family meals."],
      ["Rohu Fish Cut", "River fish pieces cleaned and packed."],
      ["Prawns Cleaned", "Ready-to-cook prawns for quick dinners."],
      ["Mutton Curry Cut", "Tender mutton pieces for slow cooking."]
    ]
  },
  {
    category: "Pharmacy",
    brand: "HealthPlus",
    baseWeight: "100 units",
    priceStart: 45,
    tags: ["health", "daily"],
    imageQuery: "pharmacy,health",
    items: [
      ["Vitamin C Tablets", "Immunity support tablets for daily wellness."],
      ["Digital Thermometer", "Quick and accurate temperature checks."],
      ["Pain Relief Spray", "Fast cooling spray for sore muscles."],
      ["Antiseptic Liquid", "First-aid antiseptic for home care."],
      ["Face Masks Pack", "Multi-layer masks for everyday protection."]
    ]
  },
  {
    category: "Kitchen Staples",
    brand: "Fortune",
    baseWeight: "1 L",
    priceStart: 75,
    tags: ["staple", "kitchen"],
    imageQuery: "kitchen,staples",
    items: [
      ["Sunflower Oil", "Light cooking oil for daily use."],
      ["Basmati Rice", "Long grain rice with fragrant aroma."],
      ["Whole Wheat Atta", "Chakki fresh atta for soft rotis."],
      ["Sugar Pack", "Refined sugar for tea, coffee, and sweets."],
      ["Iodized Salt", "Essential iodized salt for everyday meals."]
    ]
  },
  {
    category: "Spices",
    brand: "Everest",
    baseWeight: "200 g",
    priceStart: 32,
    tags: ["spice", "flavor"],
    imageQuery: "spices,masala",
    items: [
      ["Turmeric Powder", "Bright turmeric for curries and milk."],
      ["Red Chilli Powder", "Fine chilli powder with bold heat."],
      ["Coriander Powder", "Fresh coriander powder for gravies."],
      ["Garam Masala", "Aromatic all-purpose finishing masala."],
      ["Jeera Whole", "Whole cumin seeds for tadka and rice."]
    ]
  },
  {
    category: "Sweets",
    brand: "Haldiram's",
    baseWeight: "250 g",
    priceStart: 85,
    tags: ["sweet", "festival"],
    imageQuery: "indian,sweets",
    items: [
      ["Gulab Jamun Tin", "Soft syrupy gulab jamuns for desserts."],
      ["Soan Papdi Box", "Flaky sweet box for gifting and tea time."],
      ["Rasgulla Tin", "Juicy rasgullas in ready-to-serve tin."],
      ["Kaju Katli Pack", "Rich cashew sweet for celebrations."],
      ["Besan Ladoo Box", "Traditional besan ladoos with ghee aroma."]
    ]
  }
];

const buildProduct = (config, item, itemIndex, categoryIndex) => {
  const [name, description] = item;
  const price = config.priceStart + itemIndex * 12 + categoryIndex * 4;
  const mrp = price + 12 + (itemIndex % 3) * 6;
  const stock = 18 + categoryIndex * 2 + itemIndex * 6;
  const featured = categoryIndex % 3 === 0 || itemIndex === 0;

  return {
    _id: `demo-product-${categoryIndex + 1}-${itemIndex + 1}`,
    name,
    description,
    category: config.category,
    brand: config.brand,
    weight: config.baseWeight,
    price,
    mrp,
    stock,
    image: `https://source.unsplash.com/featured/900x700/?${config.imageQuery},${encodeURIComponent(
      name
    )}&sig=${categoryIndex * 10 + itemIndex + 1}`,
    rating: Number((4 + ((itemIndex + categoryIndex) % 10) / 10).toFixed(1)),
    isFeatured: featured,
    tags: [...config.tags, `${config.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${itemIndex + 1}`],
    priceComparisons: stores.map((store, storeIndex) => ({
      store,
      price: price + storeIndex * 3 + (itemIndex % 2),
      deliveryEta: `${12 + storeIndex * 8 + itemIndex} mins`
    }))
  };
};

export const catalogProducts = categoryConfigs.flatMap((config, categoryIndex) =>
  config.items.map((item, itemIndex) => buildProduct(config, item, itemIndex, categoryIndex))
);

export const categoryCount = categoryConfigs.length;
