// ======== server.js ========
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const UserModel = require('./model/UserModel');
const Product = require('./model/productModel');
const Category = require('./model/CategoryModel');
const Cart = require('./model/CartModel');
const Order = require('./model/OrderModel');
const PurchaseBook = require('./model/PurchaseBookModel');
const Inventory = require('./model/InvertoryModel');
const { authenticateUser } = require('./middleware/auth');

const app = express();
const PORT = 5000;

// MongoDB URI
const uri = process.env.MONGODB_URI;

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({ message: 'Access Denied: No token provided.', logout: true });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Access Denied: Token expired.', logout: true });
      }
      return res.status(403).json({ message: 'Access Denied: Invalid token.', logout: true });
    }
    req.userId = decoded.userId;
    next();
  });
}

mongoose.connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = new UserModel({ name, phone, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await UserModel.findOne({ phone, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: `Welcome ${user.name}, you are logged in!`,
      token: token,
      userData: {
        _id: user._id,
        name: user.name,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/products/with-category', async (req, res) => {
  try {
    const { name, pic, price, mfg, discount, offer, categoryName } = req.body;
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const newProduct = new Product({ name, pic, price, mfg, discount, offer });
    const savedProduct = await newProduct.save();
    category.Prod.push(savedProduct._id);
    await category.save();
    res.status(201).json({
      message: 'Product created and linked to category successfully',
      product: savedProduct,
      categoryUpdated: category.name
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product with category', reason: err.message });
  }
});

app.get('/products/category/:categoryName', async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.params.categoryName }).populate('Prod');
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ products: category.Prod });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get products by category' });
  }
});

app.post('/categories', async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    const saved = await newCategory.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add category', reason: err.message });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().populate('Prod');
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('Prod');
    res.json(category);
  } catch (err) {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.post('/cart', async (req, res) => {
  try {
    const newCart = new Cart(req.body);
    const saved = await newCart.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create cart' });
  }
});

app.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId }).populate('prods');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saved = await newOrder.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to place order' });
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('prod');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/purchase', async (req, res) => {
  try {
    const purchase = new PurchaseBook(req.body);
    const saved = await purchase.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to record purchase' });
  }
});

app.get('/purchase/:userId', async (req, res) => {
  try {
    const purchases = await PurchaseBook.find({ user: req.params.userId }).populate('items.productId');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

app.post('/inventory', async (req, res) => {
  try {
    const inv = new Inventory(req.body);
    const saved = await inv.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add inventory item' });
  }
});

app.get('/inventory', async (req, res) => {
  try {
    const inv = await Inventory.find().populate('godownItem.productId');
    res.json(inv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

app.get('/cartItems', (req, res) => {
  res.json({
    cartItems: [
      { id: 1, name: 'Product 1', quantity: 2 },
      { id: 2, name: 'Product 2', quantity: 1 }
    ]
  });
});

app.post("/buy", authenticateUser, async (req, res) => {
  try {
    const { prod, delPt, total, approxDate } = req.body;
    if (!prod || !Array.isArray(prod) || prod.length === 0 || !delPt || !total) {
      return res.status(400).json({ error: "Missing required order data" });
    }

    const newOrder = new Order({
      prod,
      delPt,
      total,
      approxDate: approxDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default 7 days later
      user: req.userId
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open your browser at http://localhost:${PORT}`);
});
