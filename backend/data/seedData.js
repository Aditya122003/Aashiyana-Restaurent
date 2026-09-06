const bcrypt = require('bcryptjs');

const defaultPasswordHash = bcrypt.hashSync('ashiana@1981', 10);

const branches = [
  {
    id: "chotta-shimla",
    name: "Chotta Shimla",
    slug: "chotta-shimla",
    phones: ["0177-2621350", "0177-2626142"],
    whatsapp: "919816000001",
    address: "Near Post Office, Chotta Shimla, Shimla, Himachal Pradesh 171002",
    landmark: "Main Chotta Shimla Chowk",
    timing: "08:30 AM - 10:30 PM",
    isOpen: true,
    isHeadquarter: true,
    tablesCount: 18,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "new-shimla",
    name: "New Shimla",
    slug: "new-shimla",
    phones: ["0177-2925386"],
    whatsapp: "919816000002",
    address: "Sector 1, Phase 2, Near BCS, New Shimla, Himachal Pradesh 171009",
    landmark: "BCS Commercial Complex",
    timing: "09:00 AM - 10:00 PM",
    isOpen: true,
    isHeadquarter: false,
    tablesCount: 12,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sanjaulli-engine-ghar",
    name: "Sanjaulli Engine Ghar",
    slug: "sanjaulli-engine-ghar",
    phones: ["0177-2841350"],
    whatsapp: "919816000003",
    address: "Engine Ghar Chowk, Sanjaulli, Shimla, Himachal Pradesh 171006",
    landmark: "Engine Ghar Chowk",
    timing: "09:00 AM - 10:00 PM",
    isOpen: true,
    isHeadquarter: false,
    tablesCount: 10,
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sanjaulli-main-bazaar",
    name: "Sanjaulli Main Bazaar",
    slug: "sanjaulli-main-bazaar",
    phones: ["0177-2842350", "0177-2843350"],
    whatsapp: "919816000004",
    address: "Main Market Road, Sanjaulli, Shimla, Himachal Pradesh 171006",
    landmark: "Opposite Market Complex",
    timing: "08:30 AM - 10:30 PM",
    isOpen: true,
    isHeadquarter: false,
    tablesCount: 14,
    image: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "panthaghati",
    name: "Panthaghati",
    slug: "panthaghati",
    phones: ["0177-2620350"],
    whatsapp: "919816000005",
    address: "Near Secretariat Colony, Panthaghati, Shimla, Himachal Pradesh 171009",
    landmark: "Kasumpti-Panthaghati Link",
    timing: "09:00 AM - 10:00 PM",
    isOpen: true,
    isHeadquarter: false,
    tablesCount: 16,
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80"
  }
];

const categories = [
  { id: "all", name: "All Items", icon: "🍽️" },
  { id: "popular", name: "Popular & Chef's Special", icon: "⭐" },
  { id: "sweets", name: "Authentic Sweets", icon: "🍬" },
  { id: "bakery", name: "Bakery & Cakes", icon: "🎂" },
  { id: "restaurant", name: "Restaurant Specials", icon: "🍛" },
  { id: "chinese_snacks", name: "Chinese & Snacks", icon: "🥟" },
  { id: "beverages", name: "Beverages & Shakes", icon: "🥤" }
];

const menuItems = [
  // Sweets
  {
    id: "sweet-1",
    name: "Pure Kaju Katli (Diamond Cut)",
    category: "sweets",
    description: "Signature silver-leaf topped diamond cashew fudge made from select Goan cashews and pure desi ghee.",
    defaultPrice: 380,
    unit: "500g Box",
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 428,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 380, available: true },
      "new-shimla": { price: 380, available: true },
      "sanjaulli-engine-ghar": { price: 380, available: true },
      "sanjaulli-main-bazaar": { price: 380, available: true },
      "panthaghati": { price: 380, available: true }
    }
  },
  {
    id: "sweet-2",
    name: "Hot Desi Ghee Gulab Jamun",
    category: "sweets",
    description: "Melt-in-mouth golden dumplings infused with green cardamom and saffron sugar syrup. Ashiana's legacy sweet.",
    defaultPrice: 180,
    unit: "4 Pcs",
    isVeg: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 512,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 180, available: true },
      "new-shimla": { price: 180, available: true },
      "sanjaulli-engine-ghar": { price: 170, available: true },
      "sanjaulli-main-bazaar": { price: 170, available: true },
      "panthaghati": { price: 180, available: true }
    }
  },
  {
    id: "sweet-3",
    name: "Shimla Special Motichoor Ladoo",
    category: "sweets",
    description: "Fine pearls of gram flour fried in aromatic desi ghee, garnished with melon seeds and pistachio slivers.",
    defaultPrice: 260,
    unit: "500g Box",
    isVeg: true,
    isPopular: false,
    rating: 4.7,
    reviewsCount: 189,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 260, available: true },
      "new-shimla": { price: 260, available: true },
      "sanjaulli-engine-ghar": { price: 250, available: true },
      "sanjaulli-main-bazaar": { price: 250, available: true },
      "panthaghati": { price: 260, available: true }
    }
  },
  {
    id: "sweet-4",
    name: "Alwar Milk Cake",
    category: "sweets",
    description: "Slow-cooked caramelized dense milk fudge with delicate granular texture and golden roasted core.",
    defaultPrice: 290,
    unit: "500g Box",
    isVeg: true,
    isPopular: false,
    rating: 4.8,
    reviewsCount: 165,
    image: "https://images.unsplash.com/photo-1579888944880-d98341245702?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },
  {
    id: "sweet-5",
    name: "Bengali Sponge Rasgulla",
    category: "sweets",
    description: "Feather-light cottage cheese balls dipped in fragrant rose cardamom syrup. Served chilled.",
    defaultPrice: 160,
    unit: "4 Pcs",
    isVeg: true,
    isPopular: false,
    rating: 4.6,
    reviewsCount: 130,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },

  // Bakery & Cakes
  {
    id: "bakery-1",
    name: "Belgian Chocolate Truffle Cake",
    category: "bakery",
    description: "Rich dark Belgian chocolate ganache layered with moist cocoa sponge. Ashiana's top birthday favorite.",
    defaultPrice: 550,
    unit: "500g",
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 680,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 550, available: true },
      "new-shimla": { price: 550, available: true },
      "sanjaulli-engine-ghar": { price: 520, available: true },
      "sanjaulli-main-bazaar": { price: 520, available: true },
      "panthaghati": { price: 550, available: true }
    }
  },
  {
    id: "bakery-2",
    name: "Classic Black Forest Gateau",
    category: "bakery",
    description: "Airy chocolate sponge with fresh dairy cream, sour cherries, and shaved Swiss chocolate curls.",
    defaultPrice: 480,
    unit: "500g",
    isVeg: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 410,
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 480, available: true },
      "new-shimla": { price: 480, available: true },
      "sanjaulli-engine-ghar": { price: 460, available: true },
      "sanjaulli-main-bazaar": { price: 460, available: true },
      "panthaghati": { price: 480, available: true }
    }
  },
  {
    id: "bakery-3",
    name: "Himachali Fresh Fruit Cake",
    category: "bakery",
    description: "Oven-fresh vanilla sponge loaded with seasonal Himachal kiwifruit, apples, berries, and whipped cream.",
    defaultPrice: 520,
    unit: "500g",
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 390,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },
  {
    id: "bakery-4",
    name: "Gourmet Walnut Brownie with Fudge",
    category: "bakery",
    description: "Fudgy roasted walnut brownie square made with premium Dutch cocoa and molten chocolate drizzle.",
    defaultPrice: 120,
    unit: "1 Pc",
    isVeg: true,
    isPopular: false,
    rating: 4.7,
    reviewsCount: 220,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },
  {
    id: "bakery-5",
    name: "Golden Butter Croissant",
    category: "bakery",
    description: "Flaky, buttery French-style layered pastry baked fresh every morning in our Chotta Shimla ovens.",
    defaultPrice: 90,
    unit: "1 Pc",
    isVeg: true,
    isPopular: false,
    rating: 4.6,
    reviewsCount: 140,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },

  // Restaurant Dishes
  {
    id: "rest-1",
    name: "Dal Makhani 'Ashiana Royal'",
    category: "restaurant",
    description: "Slow-simmered whole black lentils cooked overnight on charcoal with butter, cream, and Himalayan spices.",
    defaultPrice: 280,
    unit: "Full Portion",
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 750,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 280, available: true },
      "new-shimla": { price: 280, available: true },
      "sanjaulli-engine-ghar": { price: 260, available: true },
      "sanjaulli-main-bazaar": { price: 260, available: true },
      "panthaghati": { price: 280, available: true }
    }
  },
  {
    id: "rest-2",
    name: "Paneer Butter Masala",
    category: "restaurant",
    description: "Soft cottage cheese cubes cooked in a silky, buttery tomato-cashew gravy with fenugreek aroma.",
    defaultPrice: 320,
    unit: "Full Portion",
    isVeg: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 620,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 320, available: true },
      "new-shimla": { price: 320, available: true },
      "sanjaulli-engine-ghar": { price: 300, available: true },
      "sanjaulli-main-bazaar": { price: 300, available: true },
      "panthaghati": { price: 320, available: true }
    }
  },
  {
    id: "rest-3",
    name: "Murgh Butter Chicken (Non-Veg)",
    category: "restaurant",
    description: "Smoky tandoori chicken cooked in rich velvet tomato makhani gravy enriched with fresh cream and butter.",
    defaultPrice: 390,
    unit: "Full Portion",
    isVeg: false,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 840,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 390, available: true },
      "new-shimla": { price: 390, available: true },
      "sanjaulli-engine-ghar": { price: 370, available: true },
      "sanjaulli-main-bazaar": { price: 370, available: true },
      "panthaghati": { price: 390, available: true }
    }
  },
  {
    id: "rest-4",
    name: "Tandoori Chicken Tikka Platter",
    category: "restaurant",
    description: "Juicy boneless chicken marinated in hung curd and red chili paste, roasted in clay oven. Served with mint chutney.",
    defaultPrice: 340,
    unit: "8 Pcs",
    isVeg: false,
    isPopular: false,
    rating: 4.8,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },
  {
    id: "rest-5",
    name: "Garlic Butter Naan Basket",
    category: "restaurant",
    description: "Tandoor-baked leavened bread topped with minced mountain garlic and drenched in churned butter.",
    defaultPrice: 75,
    unit: "2 Pcs",
    isVeg: true,
    isPopular: false,
    rating: 4.7,
    reviewsCount: 450,
    image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },

  // Chinese & Snacks
  {
    id: "chinese-1",
    name: "Himalayan Steamed Veg Momos",
    category: "chinese_snacks",
    description: "Handcrafted dumplings filled with finely chopped mountain cabbage, carrots, ginger, served with fiery red chili dip.",
    defaultPrice: 140,
    unit: "8 Pcs",
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 920,
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 140, available: true },
      "new-shimla": { price: 140, available: true },
      "sanjaulli-engine-ghar": { price: 130, available: true },
      "sanjaulli-main-bazaar": { price: 130, available: true },
      "panthaghati": { price: 140, available: true }
    }
  },
  {
    id: "chinese-2",
    name: "Special Veg Hakka Chowmein",
    category: "chinese_snacks",
    description: "Wok-tossed noodles with crunchy bell peppers, cabbage, spring onions, and garlic soya sauce.",
    defaultPrice: 160,
    unit: "Full Plate",
    isVeg: true,
    isPopular: true,
    rating: 4.7,
    reviewsCount: 510,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    branchPricing: {
      "chotta-shimla": { price: 160, available: true },
      "new-shimla": { price: 160, available: true },
      "sanjaulli-engine-ghar": { price: 150, available: true },
      "sanjaulli-main-bazaar": { price: 150, available: true },
      "panthaghati": { price: 160, available: true }
    }
  },
  {
    id: "chinese-3",
    name: "Crispy Honey Chili Potato",
    category: "chinese_snacks",
    description: "Crispy fried potato fingers coated in spicy-sweet honey chili sauce and toasted sesame seeds.",
    defaultPrice: 170,
    unit: "Full Plate",
    isVeg: true,
    isPopular: false,
    rating: 4.6,
    reviewsCount: 280,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },
  {
    id: "chinese-4",
    name: "Paneer Manchurian Dry",
    category: "chinese_snacks",
    description: "Tossed paneer cubes with green chilies, coriander stems, capsicum, and ginger scallion sauce.",
    defaultPrice: 220,
    unit: "Full Plate",
    isVeg: true,
    isPopular: false,
    rating: 4.7,
    reviewsCount: 195,
    image: "https://images.unsplash.com/photo-1567337710282-00832b415979?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },

  // Beverages & Bar
  {
    id: "bev-1",
    name: "Himalayan Buransh (Rhododendron) Cooler",
    category: "beverages",
    description: "Traditional Himachali floral cooler infused with mountain lemon and fresh mint. Rejuvenating local specialty.",
    defaultPrice: 110,
    unit: "350 ml",
    isVeg: true,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 340,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },
  {
    id: "bev-2",
    name: "Thick Cold Coffee with Chocolate Ice Cream",
    category: "beverages",
    description: "Brewed espresso blended with whole milk and topped with a generous scoop of chocolate ice cream.",
    defaultPrice: 130,
    unit: "350 ml",
    isVeg: true,
    isPopular: true,
    rating: 4.8,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  },
  {
    id: "bev-3",
    name: "Fresh Mint Mojito Mocktail",
    category: "beverages",
    description: "Muddled fresh garden mint, zesty lime wedges, simple cane syrup, topped with sparkling club soda.",
    defaultPrice: 120,
    unit: "350 ml",
    isVeg: true,
    isPopular: false,
    rating: 4.7,
    reviewsCount: 210,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    branchPricing: {}
  }
];

const admins = [
  {
    id: "admin-1",
    username: "admin",
    passwordHash: defaultPasswordHash, // ashiana@1981
    name: "Ashiana Superadmin",
    role: "superadmin"
  }
];

module.exports = {
  branches,
  categories,
  menuItems,
  admins,
  reservations: [],
  orders: []
};
