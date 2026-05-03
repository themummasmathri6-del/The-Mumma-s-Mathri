const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env if available

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// If you don't have a .env file yet, it will fallback to this example string.
// ALWAYS put your real URI in a .env file as MONGODB_URI=mongodb+srv://...
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mummasmathri";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Successfully Connected!"))
    .catch((error) => console.log("❌ MongoDB Connection Failed: ", error));

// --- MONGOOSE SCHEMAS & MODELS ---

// 1. User Model
const UserSchema = new mongoose.Schema({
    // We use a custom string ID for standardizing with your frontend, or let Mongo use _id
    id: { type: String, required: true, unique: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true } // In production, never store raw passwords! Use bcrypt.
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

// 2. Product Model
const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    category: String
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

// 3. Order Model
const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userName: String,
    userEmail: String,
    totalAmount: Number,
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now },
    items: Array // simplified for ease; ideally an array of structured objects
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema);


// ==========================================
//                   ROUTES
// ==========================================

// --- PRODUCTS API ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        // If empty, you might want to auto-insert default products here for testing
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});


// --- ORDERS API ---
app.get('/api/orders', async (req, res) => {
    try {
        // Fetch orders sorted by newest first
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;

        // Create new order in MongoDB
        const newOrder = await Order.create({
            ...orderData,
            id: `ORD-${Date.now()}`,
            status: 'Pending',
            date: new Date()
        });

        res.status(201).json({ message: 'Order received!', order: newOrder });
    } catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
});


// --- DASHBOARD API ---
app.get('/api/stats', async (req, res) => {
    try {
        // Run aggregations directly in the database for blazing fast performance!
        const orders = await Order.find();
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === 'Pending').length;
        const totalUsers = await User.countDocuments();
        
        res.json({
            totalRevenue,
            totalOrders,
            pendingOrders,
            newCustomers: totalUsers
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to load dashboard stats" });
    }
});


// --- AUTHENTICATION API ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        // Check if user already exists in MongoDB
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        // Insert new user into MongoDB
        const newUser = await User.create({ 
            id: `USR-${Date.now()}`, 
            name, 
            email, 
            password 
        });

        res.status(201).json({ message: 'Registration successful!', user: { email: newUser.email, name: newUser.name } });
    } catch (err) {
        res.status(500).json({ error: "Server error during registration" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email in MongoDB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found. Please register.' });
        }

        // Verify password
        if (user.password !== password) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Success response
        res.json({ message: 'Login successful!', token: 'dummy-auth-token-12345', user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
