import express from "express";
import bodyParser from "body-parser";
import db from "./db.js";
import dotenv from "dotenv";
import session from "express-session";
import bcrypt from "bcrypt";
import cors from "cors";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "http://localhost:3001", // frontend origin (adjust if needed)
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false
}));

// Authentication Middleware
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ======================= Auth Routes =======================

// Register (POST)
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashed]);
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (POST)
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
  if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });

  const match = await bcrypt.compare(password, result.rows[0].password);
  if (match) {
    req.session.userId = result.rows[0].id;
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Incorrect password" });
  }
});

// Logout (POST)
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

// ======================= Inventory Routes =======================

// Get all inventory items
app.get("/api/inventory", requireLogin, async (req, res) => {
  const { sort, search } = req.query;
  let orderBy = "id";
  if (sort === "category") orderBy = "category";
  if (sort === "price") orderBy = "price";

  try {
    let result;
    if (search) {
      result = await db.query(
        `SELECT * FROM inventory WHERE name ILIKE $1 ORDER BY ${orderBy}`,
        [`%${search}%`]
      );
    } else {
      result = await db.query(`SELECT * FROM inventory ORDER BY ${orderBy}`);
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new item
app.post("/api/inventory", requireLogin, async (req, res) => {
  const { name, quantity, category, price } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO inventory (name, quantity, category, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, quantity, category, price]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update item
app.put("/api/inventory/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  const { name, quantity, category, price } = req.body;
  try {
    await db.query(
      "UPDATE inventory SET name = $1, quantity = $2, category = $3, price = $4 WHERE id = $5",
      [name, quantity, category, price, id]
    );
    res.json({ message: "Item updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete item
app.delete("/api/inventory/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM inventory WHERE id=$1", [id]);
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================= Start Server =======================
app.listen(port, () => {
  console.log(`✅ API Server running at http://localhost:${port}`);
});
