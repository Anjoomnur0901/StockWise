import express from "express";
import bodyParser from "body-parser";
import db from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import bcrypt from "bcrypt";
dotenv.config();

// Setup path handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Express
const app = express();
const port = process.env.PORT || 3000;

// View engine and public folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false
}));
// 🧾 Routes
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
}
// Register and Login routes
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, hashed]);
    res.redirect("/login");
  } catch (err) {
    res.send("Registration error: " + err.message);
  }
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

  if (result.rows.length === 0) return res.send("User not found");

  const match = await bcrypt.compare(password, result.rows[0].password);
  if (match) {
    req.session.userId = result.rows[0].id;
    res.redirect("/");
  } else {
    res.send("Incorrect password");
  }
});
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Home – show all items
app.get("/",requireLogin, async (req, res) => {
  const { sort } = req.query;

  let orderBy = "id";
  if (sort === "category") orderBy = "category";
  if (sort === "price") orderBy = "price";

  try {
    const result = await db.query(`SELECT * FROM inventory ORDER BY ${orderBy}`);
    res.render("index.ejs", { items: result.rows });
  } catch (error) {
    res.send("Error fetching inventory: " + error.message);
  }
});


// Add new item
app.post("/add", async (req, res) => {
  const { name, quantity, category, price } = req.body;
  try {
    await db.query(
      "INSERT INTO inventory (name, quantity, category, price) VALUES ($1, $2, $3, $4)",
      [name, quantity, category, price]
    );
    res.redirect("/");
  } catch (error) {
    res.send("Error adding item: " + error.message);
  }
});
// Update item
app.post("/update", async (req, res) => {
  const { id, name, quantity, category, price } = req.body;
  try {
    await db.query(
      "UPDATE inventory SET name = $1, quantity = $2, category = $3, price = $4 WHERE id = $5",
      [name, quantity, category, price, id]
    );
    res.redirect("/");
  } catch (error) {
    res.send("Error updating item: " + error.message);
  }
});

// Delete item
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await db.query("DELETE FROM inventory WHERE id=$1", [id]);
    res.redirect("/");
  } catch (error) {
    res.send("Error deleting item: " + error.message);
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
