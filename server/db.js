import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data matching prompt requirements
const defaultProducts = [
  {
    id: "p1",
    name: "Pomegranate",
    localName: "Anar",
    category: "Fruits",
    price: 199,
    unit: "1 kg",
    unitOptions: ["1 kg", "2 kg", "3 kg", "5 kg"],
    shortDescription: "Sweet, juicy ruby-red farm fresh pomegranates.",
    image: "/uploads/pomegranate.jpg",
    inStock: true,
    badge: "Bestseller",
    minQty: 1
  },
  {
    id: "p2",
    name: "Custard Apple",
    localName: "Sitaphal",
    category: "Fruits",
    price: 199,
    unit: "1 kg",
    unitOptions: ["1 kg", "2 kg", "3 kg"],
    shortDescription: "Naturally sweet, creamy pulp handpicked at ideal ripeness.",
    image: "/uploads/sitaphal.jpg",
    inStock: true,
    badge: "Seasonal Special",
    minQty: 1
  },
  {
    id: "p3",
    name: "Farm Fresh Onion",
    localName: "Kanda / Pyaz",
    category: "Vegetables",
    price: 35,
    unit: "1 kg",
    unitOptions: ["1 kg", "2 kg", "5 kg", "10 kg"],
    shortDescription: "Essential daily cooking onions direct from Maharashtra farms.",
    image: "/uploads/onion.jpg",
    inStock: true,
    badge: "Farm Fresh",
    minQty: 1
  },
  {
    id: "p4",
    name: "Fresh Lemon",
    localName: "Nimbu",
    category: "Vegetables",
    price: 20,
    unit: "4 pcs",
    unitOptions: ["4 pcs", "8 pcs", "12 pcs", "20 pcs"],
    shortDescription: "Juicy, full of flavor lemons for daily refreshment.",
    image: "/uploads/lemon.jpg",
    inStock: true,
    badge: "Fresh Pick",
    minQty: 1
  },
  {
    id: "p5",
    name: "Fresh Curry Leaves",
    localName: "Kadipatta",
    category: "Herbs",
    price: 20,
    unit: "50 g",
    unitOptions: ["50 g", "100 g", "250 g"],
    shortDescription: "Aromatic, fresh green curry leaves for authentic temperings.",
    image: "/uploads/curry_leaves.jpg",
    inStock: true,
    badge: "Aromatic",
    minQty: 1
  }
];

const defaultSettings = {
  sellerPhone: "8087506237",
  formattedSellerPhone: "80875 06237",
  sellerEmail: "orders@sundaybasket.in",
  deliveryFee: 0,
  minOrderValue: 0,
  freeDeliveryThreshold: 0,
  orderCutoffNotice: "Order before Wednesday 10 PM for Weekend Delivery in Pune",
  selectedPuneLocations: [
    "Kothrud", "Baver", "Aundh", "Wakad", "Hinjawadi", 
    "Viman Nagar", "Kharadi", "Hadapsar", "Pimple Saudagar", "Magarpatta"
  ],
  notificationsEnabled: {
    whatsapp: true,
    dashboard: true,
    webhook: false,
    webhookUrl: ""
  }
};

let dbData = {
  products: defaultProducts,
  orders: [],
  settings: defaultSettings,
  nextOrderNum: 1001
};

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(raw);
    } else {
      saveDatabase();
    }
  } catch (err) {
    console.error("Failed to load database, using defaults:", err);
    saveDatabase();
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to save database:", err);
  }
}

// Load on start
loadDatabase();

export const db = {
  getProducts: (includeOutofStock = true) => {
    loadDatabase();
    if (includeOutofStock) return dbData.products;
    return dbData.products.filter(p => p.inStock);
  },

  getProductById: (id) => {
    loadDatabase();
    return dbData.products.find(p => p.id === id);
  },

  addProduct: (product) => {
    loadDatabase();
    const newId = 'p' + (Date.now());
    const newProd = { id: newId, inStock: true, ...product };
    dbData.products.push(newProd);
    saveDatabase();
    return newProd;
  },

  updateProduct: (id, updates) => {
    loadDatabase();
    const index = dbData.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    dbData.products[index] = { ...dbData.products[index], ...updates };
    saveDatabase();
    return dbData.products[index];
  },

  deleteProduct: (id) => {
    loadDatabase();
    const index = dbData.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    dbData.products.splice(index, 1);
    saveDatabase();
    return true;
  },

  getOrders: () => {
    loadDatabase();
    return dbData.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getOrderById: (id) => {
    loadDatabase();
    return dbData.orders.find(o => o.id === id);
  },

  createOrder: (orderData) => {
    loadDatabase();
    const orderId = `SB-${dbData.nextOrderNum++}`;
    const newOrder = {
      id: orderId,
      status: 'New',
      createdAt: new Date().toISOString(),
      ...orderData
    };
    dbData.orders.unshift(newOrder);
    saveDatabase();
    return newOrder;
  },

  updateOrderStatus: (id, status) => {
    loadDatabase();
    const order = dbData.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    saveDatabase();
    return order;
  },

  getSettings: () => {
    loadDatabase();
    return dbData.settings;
  },

  updateSettings: (newSettings) => {
    loadDatabase();
    dbData.settings = { ...dbData.settings, ...newSettings };
    saveDatabase();
    return dbData.settings;
  }
};
