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
  },
  {
    category: "Electronics",
    brand: "VoltEdge",
    baseWeight: "1 unit",
    priceStart: 699,
    tags: ["tech", "gadgets"],
    imageQuery: "electronics,gadgets",
    items: [
      ["Wireless Earbuds", "Compact earbuds with punchy sound and all-day battery."],
      ["Fast Charger 33W", "Quick charging adapter for phones and tablets."],
      ["Smartwatch Active", "Fitness-first smartwatch with call and sleep tracking."],
      ["Bluetooth Speaker Mini", "Portable speaker with crisp sound and deep bass."],
      ["Power Bank 10000mAh", "Pocket-friendly backup power for travel and commute."]
    ]
  },
  {
    category: "Fashion",
    brand: "Urban Thread",
    baseWeight: "1 piece",
    priceStart: 499,
    tags: ["style", "clothing"],
    imageQuery: "fashion,clothes",
    items: [
      ["Oversized Cotton Tee", "Relaxed fit tee for everyday casual styling."],
      ["Slim Fit Jeans", "Stretch denim jeans with modern tapered fit."],
      ["Classic Hoodie", "Soft brushed hoodie for cool evenings and travel."],
      ["Printed Summer Dress", "Easy day dress with breathable fabric and light drape."],
      ["Polo Shirt", "Clean smart-casual polo for work or weekends."]
    ]
  },
  {
    category: "Footwear",
    brand: "StrideLab",
    baseWeight: "1 pair",
    priceStart: 899,
    tags: ["shoes", "lifestyle"],
    imageQuery: "footwear,shoes",
    items: [
      ["Running Sneakers", "Lightweight sneakers designed for daily runs and walks."],
      ["Slides Comfort", "Cushioned slides for home, gym, and quick errands."],
      ["Canvas Casual Shoes", "Everyday lace-up shoes with minimal clean profile."],
      ["Women Flat Sandals", "Comfort sandals with flexible sole and easy straps."],
      ["Training Shoes", "Stable shoes built for gym and cross-training sessions."]
    ]
  },
  {
    category: "Home Decor",
    brand: "Casa Bloom",
    baseWeight: "1 item",
    priceStart: 349,
    tags: ["home", "decor"],
    imageQuery: "home,decor",
    items: [
      ["Scented Candle Jar", "Warm fragrance candle for bedrooms and living rooms."],
      ["Cushion Cover Set", "Soft decorative covers to refresh your sofa instantly."],
      ["Wall Art Frame", "Modern framed print for entryways and study corners."],
      ["Table Lamp Glow", "Ambient lamp for bedside reading and soft mood lighting."],
      ["Ceramic Vase", "Minimal vase for dried stems and floral styling."]
    ]
  },
  {
    category: "Mobile Accessories",
    brand: "CaseCraft",
    baseWeight: "1 unit",
    priceStart: 249,
    tags: ["mobile", "accessories"],
    imageQuery: "mobile,accessories",
    items: [
      ["Silicone Phone Case", "Shock-absorbing case with slim matte finish."],
      ["Tempered Glass Pack", "Scratch-resistant screen protection with easy install."],
      ["Car Phone Mount", "Secure dashboard mount for maps and hands-free calls."],
      ["Braided USB-C Cable", "Durable fast-charge cable with reinforced connectors."],
      ["MagSafe Wallet", "Snap-on card wallet with strong magnetic hold."]
    ]
  },
  {
    category: "Beauty",
    brand: "Glow Theory",
    baseWeight: "120 ml",
    priceStart: 299,
    tags: ["beauty", "skincare"],
    imageQuery: "beauty,skincare",
    items: [
      ["Vitamin C Serum", "Brightening serum for daily glow and even tone."],
      ["Hydrating Face Mist", "Cooling mist for instant freshness during the day."],
      ["Matte Lip Color", "Long-wear lip shade with smooth comfortable finish."],
      ["Sunscreen SPF 50", "Lightweight sun protection for everyday outdoor use."],
      ["Night Repair Cream", "Rich overnight cream for deep hydration and softness."]
    ]
  },
  {
    category: "Books & Stationery",
    brand: "PaperTrail",
    baseWeight: "1 piece",
    priceStart: 149,
    tags: ["books", "stationery"],
    imageQuery: "books,stationery",
    items: [
      ["Hardbound Notebook", "Premium ruled notebook for journaling and planning."],
      ["Gel Pen Set", "Smooth-writing pen pack for study and office work."],
      ["Desk Planner", "Weekly desk planner to organize goals and tasks."],
      ["Sticky Notes Combo", "Colorful notes for reminders, study, and workboards."],
      ["Reading Lamp Clip", "Clip light for night reading and focused study."]
    ]
  },
  {
    category: "Sports & Fitness",
    brand: "ActiveCore",
    baseWeight: "1 unit",
    priceStart: 399,
    tags: ["fitness", "sports"],
    imageQuery: "fitness,sports",
    items: [
      ["Yoga Mat Pro", "Grip-friendly exercise mat for yoga and floor workouts."],
      ["Resistance Band Set", "Multi-strength bands for home strength training."],
      ["Protein Shaker", "Leak-resistant shaker bottle with mixing ball."],
      ["Skipping Rope", "Adjustable rope for quick cardio sessions anywhere."],
      ["Gym Gloves", "Breathable gloves with palm grip and wrist support."]
    ]
  },
  {
    category: "Toys & Games",
    brand: "PlayNest",
    baseWeight: "1 unit",
    priceStart: 279,
    tags: ["toys", "kids"],
    imageQuery: "toys,games",
    items: [
      ["Building Blocks Set", "Colorful creative blocks for fun learning play."],
      ["Remote Control Car", "Fast mini RC car for indoor and outdoor play."],
      ["Puzzle Challenge 500", "Brainy puzzle set for family game evenings."],
      ["Plush Teddy Bear", "Soft cuddle toy with premium fabric finish."],
      ["Art & Craft Kit", "Hands-on creativity box with colors, paper, and tools."]
    ]
  },
  {
    category: "Kitchen Appliances",
    brand: "HomePulse",
    baseWeight: "1 unit",
    priceStart: 1199,
    tags: ["kitchen", "appliances"],
    imageQuery: "kitchen,appliances",
    items: [
      ["Mixer Grinder", "Compact kitchen grinder for chutneys, shakes, and masalas."],
      ["Electric Kettle", "Fast-boil kettle for tea, coffee, and instant meals."],
      ["Air Fryer Mini", "Low-oil fryer for crispy snacks and quick meals."],
      ["Hand Blender", "Lightweight blender for soups, shakes, and sauces."],
      ["Sandwich Maker", "Non-stick toaster for quick breakfast sandwiches."]
    ]
  },
  {
    category: "Footwear",
    brand: "StrideCraft",
    baseWeight: "1 pair",
    priceStart: 799,
    tags: ["footwear", "fashion"],
    imageQuery: "footwear,shoes",
    items: [
      ["Running Shoes", "Lightweight running shoes with cushioned everyday comfort."],
      ["Slides Comfort", "Easy slip-on slides for home, errands, and travel."],
      ["Canvas Sneakers", "Classic lace-up sneakers with clean street-ready style."],
      ["Training Shoes", "Stable training pair for gym sessions and walks."],
      ["Kids Sport Shoes", "Durable sporty shoes designed for active kids."]
    ]
  },
  {
    category: "Home Decor",
    brand: "CasaBloom",
    baseWeight: "1 unit",
    priceStart: 349,
    tags: ["decor", "home"],
    imageQuery: "home,decor",
    items: [
      ["Scented Candle Jar", "Mood-setting candle with a warm lingering fragrance."],
      ["Boho Cushion Cover", "Textured cushion cover to refresh your sofa corners."],
      ["Table Vase", "Minimal decorative vase for living room and dining setups."],
      ["Wall Frame Set", "Coordinated art frames for a polished gallery wall."],
      ["Fairy Lights String", "Soft ambient lights for bedrooms and festive styling."]
    ]
  },
  {
    category: "Health & Wellness",
    brand: "Wellspire",
    baseWeight: "1 pack",
    priceStart: 259,
    tags: ["health", "wellness"],
    imageQuery: "health,wellness",
    items: [
      ["Multivitamin Tablets", "Daily nutrition support for active lifestyles."],
      ["Electrolyte Drink Mix", "Hydration support with refreshing citrus flavor."],
      ["Vitamin D3 Capsules", "Convenient wellness capsules for daily routines."],
      ["Herbal Sleep Tea", "Calming herbal infusion for restful evening wind-downs."],
      ["Protein Energy Bars", "On-the-go snack bars with balanced protein support."]
    ]
  },
  {
    category: "Office Essentials",
    brand: "WorkGrid",
    baseWeight: "1 unit",
    priceStart: 189,
    tags: ["office", "work"],
    imageQuery: "office,desk",
    items: [
      ["Wireless Mouse", "Responsive mouse for smooth work and study sessions."],
      ["Laptop Stand", "Ergonomic stand for better posture and desk airflow."],
      ["Document Folder Set", "Neat file folders for organized office paperwork."],
      ["Desk Organizer Tray", "Multi-slot tray to keep stationery within reach."],
      ["Webcam Cover Pack", "Simple privacy covers for laptops and monitors."]
    ]
  },
  {
    category: "Travel",
    brand: "TripNest",
    baseWeight: "1 unit",
    priceStart: 499,
    tags: ["travel", "utility"],
    imageQuery: "travel,accessories",
    items: [
      ["Packing Cubes Set", "Travel cubes that keep clothing sorted and compact."],
      ["Neck Pillow Memory", "Soft neck pillow for flights, buses, and road trips."],
      ["Passport Holder", "Slim organizer for passport, cards, and boarding slips."],
      ["Luggage Tag Duo", "Durable travel tags for quick suitcase identification."],
      ["Foldable Duffel Bag", "Extra travel bag that folds down when not in use."]
    ]
  },
  {
    category: "Watches & Accessories",
    brand: "UrbanDial",
    baseWeight: "1 unit",
    priceStart: 899,
    tags: ["watches", "accessories"],
    imageQuery: "watch,accessories",
    items: [
      ["Classic Analog Watch", "Versatile wrist watch with a timeless everyday dial."],
      ["Smartwatch Strap", "Comfortable replacement strap with secure fit."],
      ["Sunglasses UV400", "Stylish sunglasses with strong everyday sun protection."],
      ["Minimal Wallet", "Compact wallet built for cards, cash, and quick access."],
      ["Bracelet Combo", "Layered accessory set for modern casual styling."]
    ]
  },
  {
    category: "Automotive",
    brand: "RoadCore",
    baseWeight: "1 unit",
    priceStart: 279,
    tags: ["automotive", "car"],
    imageQuery: "car,accessories",
    items: [
      ["Car Perfume Fresh", "Long-lasting cabin fragrance for cleaner-feeling drives."],
      ["Microfiber Cleaning Cloth", "Soft cloth for dashboards, glass, and touch screens."],
      ["Tyre Pressure Gauge", "Compact tool for routine tyre pressure checks."],
      ["Car Vacuum Mini", "Portable cleaner for crumbs, dust, and small spills."],
      ["Seat Headrest Hook", "Utility hook for bags, groceries, and daily essentials."]
    ]
  },
  {
    category: "Party Supplies",
    brand: "CelebrateIt",
    baseWeight: "1 pack",
    priceStart: 149,
    tags: ["party", "events"],
    imageQuery: "party,supplies",
    items: [
      ["Balloon Arch Kit", "Easy party setup kit for birthdays and special events."],
      ["Paper Plate Combo", "Disposable plate set for quick entertaining."],
      ["Birthday Banner", "Bright decorative banner for festive celebrations."],
      ["Photo Booth Props", "Fun party prop set for group pictures and reels."],
      ["LED Cake Topper", "Light-up topper to elevate celebration cakes instantly."]
    ]
  },
  {
    category: "Gardening",
    brand: "LeafLoom",
    baseWeight: "1 unit",
    priceStart: 229,
    tags: ["gardening", "plants"],
    imageQuery: "gardening,plants",
    items: [
      ["Watering Can", "Easy-pour can for indoor plants and balcony gardens."],
      ["Plant Pot Set", "Minimal pot combo for herbs, flowers, and home greens."],
      ["Garden Tool Kit", "Starter tool kit for pruning, digging, and potting."],
      ["Indoor Plant Feed", "Balanced nutrient mix for healthier leafy growth."],
      ["Seed Starter Tray", "Tray set to begin seedlings cleanly at home."]
    ]
  },
  {
    category: "Smart Home",
    brand: "NexaNest",
    baseWeight: "1 unit",
    priceStart: 1299,
    tags: ["smart-home", "electronics"],
    imageQuery: "smart,home",
    items: [
      ["Smart Bulb RGB", "App-controlled bulb with dimming and color scenes."],
      ["WiFi Plug Mini", "Smart plug to automate appliances from your phone."],
      ["Video Door Sensor", "Compact sensor setup for simple door status alerts."],
      ["Motion Night Light", "Automatic night light for hallways and bedrooms."],
      ["Bluetooth Tracker Tag", "Attach-and-find tracker for keys, bags, and gear."]
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
