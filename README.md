# 📦 StockWise – Inventory Management App

StockWise is a full-stack inventory management application built with **Node.js**, **PostgreSQL**, **React**, and **Material UI (MUI)**. It includes user authentication, inventory CRUD, visual insights, and CSV export. Built for portfolio and practical business use.

---

## 🔧 Features

### ✅ Authentication
- Register/Login/Logout using `express-session`
- Passwords hashed with `bcrypt`
- Session-based protection for all inventory routes

### 📊 Inventory Management
- Add, update, delete inventory items
- View inventory sorted by name, category, or price
- Search inventory items by name
- Low-stock warning with row highlighting

### 📈 Visual Insights
- Pie chart showing inventory value per category (built with **Recharts**)

### 📁 Export
- Download inventory table as a `.csv` file

### 🛡️ Role-Based Access (Planned)
- `admin`: Full access to add/edit/delete
- `viewer`: Read-only access

---

## 🗃️ Tech Stack

| Layer      | Technology                        |
|------------|------------------------------------|
| Frontend   | React, React Router, Material UI   |
| Charts     | Recharts                           |
| Backend    | Express.js, Node.js                |
| Database   | PostgreSQL                         |
| Auth       | express-session, bcrypt            |
| API        | RESTful JSON API                   |
| Styling    | Material UI (MUI)                  |

---

## ⚙️ Setup Instructions

### 1. Backend (Node.js + Express + PostgreSQL)

```bash
cd backend
npm install
##.env
PORT=3000
PGUSER=postgres
PGPASSWORD=1234
PGHOST=localhost
PGPORT=5433
PGDATABASE=stockwise
SESSION_SECRET=myverysecuresecret
##SQL
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin'
);

-- Inventory
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INT NOT NULL,
  category TEXT,
  price FLOAT
);
##Start the server 
node index.js
npm start
