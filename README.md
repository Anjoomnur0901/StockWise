# StockWise
# 📦 StockWise

**StockWise** is an inventory management application built using **Node.js**, **Express**, **PostgreSQL**, and **EJS** for server-side rendering. It supports **user registration/login**, and lets users manage a list of inventory items.

---

## 🚀 Features

- ✅ User Registration & Login (using bcrypt + express-session)
- ✅ Add, Edit, Delete inventory items
- ✅ Low-stock visual warning (e.g., quantity < 5)
- ✅ Sort items by category or price
- ✅ EJS templates with forms for interaction

---

## 🛠️ Tech Stack

| Tech          | Use                             |
|---------------|----------------------------------|
| Node.js       | Backend runtime                 |
| Express.js    | Web server                      |
| PostgreSQL    | Database                        |
| EJS           | HTML templating engine          |
| bcrypt        | Password hashing                |
| express-session | User session management       |

---

## 📁 Project Structure

stockwise/
└── backend/
    ├── index.js           ← main server file
    ├── db.js              ← PostgreSQL connection using pg.Client
    ├── views/
    │   └── index.ejs      ← EJS template
    ├── public/            ← static files (CSS/images)
    └── .env               ← environment variables
