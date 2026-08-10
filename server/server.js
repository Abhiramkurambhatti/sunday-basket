import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { NotificationService } from './notificationService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const notificationService = new NotificationService(() => db.getSettings());

app.use(cors());
app.use(express.json());

// Serve static uploaded assets
const publicDir = path.join(__dirname, '../public');
app.use('/uploads', express.static(path.join(publicDir, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------------- PUBLIC API ----------------

// Get products catalog
app.get('/api/products', (req, res) => {
  try {
    const products = db.getProducts(true);
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get settings (public details like cutoff notice, locations)
app.get('/api/settings', (req, res) => {
  try {
    const settings = db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit new guest order
app.post('/api/orders', async (req, res) => {
  try {
    const { items, customer, totalAmount } = req.body;

    // Basic Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty. Please add items." });
    }

    if (!customer || !customer.fullName || !customer.mobileNumber || !customer.address || !customer.societyName || !customer.flatNo) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required delivery fields. Full Name, Mobile Number, Flat/House No, Society Name, and Delivery Address are required." 
      });
    }

    // Verify stock availability
    for (const item of items) {
      const product = db.getProductById(item.id);
      if (!product || !product.inStock) {
        return res.status(400).json({ 
          success: false, 
          error: `Sorry, "${item.name}" is currently out of stock.` 
        });
      }
    }

    // Create persistent order
    const newOrder = db.createOrder({
      items,
      customer,
      totalAmount,
      paymentMethod: 'Cash / UPI on Delivery'
    });

    // Trigger Notification Engine
    const notificationResult = await notificationService.notifyNewOrder(newOrder);

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder,
      whatsAppUrl: notificationResult.channels.whatsapp?.waLink,
      formattedMessage: notificationService.formatOrderWhatsAppMessage(newOrder)
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch single order details
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ---------------- ADMIN API ----------------

const ADMIN_KEY = process.env.ADMIN_KEY || "admin123";

// Admin simple auth middleware
const authAdmin = (req, res, next) => {
  const token = req.headers['x-admin-key'] || req.query.admin_key;
  if (token === ADMIN_KEY) {
    next();
  } else {
    res.status(401).json({ success: false, error: "Unauthorized access. Invalid Admin Key." });
  }
};

// Admin login check
app.post('/api/admin/login', (req, res) => {
  const { key } = req.body;
  if (key === ADMIN_KEY) {
    res.json({ success: true, token: ADMIN_KEY });
  } else {
    res.status(401).json({ success: false, error: "Invalid Security Key" });
  }
});

// Admin get all orders
app.get('/api/admin/orders', authAdmin, (req, res) => {
  try {
    const orders = db.getOrders();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin update order status
app.patch('/api/admin/orders/:id/status', authAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status value" });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Product CRUD
app.post('/api/admin/products', authAdmin, (req, res) => {
  try {
    const newProd = db.addProduct(req.body);
    res.status(201).json({ success: true, product: newProd });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/products/:id', authAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/products/:id', authAdmin, (req, res) => {
  try {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin update settings
app.put('/api/admin/settings', authAdmin, (req, res) => {
  try {
    const settings = db.updateSettings(req.body);
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve built frontend assets
app.use(express.static(publicDir));

// Catch-all route to serve SPA in production
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(publicDir, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌱 Sunday Basket Backend Server running on http://localhost:${PORT}`);
  console.log(`🔑 Admin Key: ${ADMIN_KEY}\n`);
});
