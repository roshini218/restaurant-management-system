# 🍽️ Regal Crest — Restaurant Management System

A full-stack Restaurant Management System built with **React**, **Node.js (Express)**, and **SQLite**. Designed as a DBMS project with a schema-first, SQL-centric architecture where all database logic is centralized in the `/db` directory.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [Menu Categories](#menu-categories)

---

## Overview

**Snack n Joy** is a restaurant management web application that allows staff to:
- Browse and select items from a categorized Indian cuisine menu
- Place orders for specific table numbers
- Track and manage active/pending orders
- Auto-generate bills with 5% GST
- View a revenue summary dashboard and recent activity logs

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, Axios |
| Backend    | Node.js, Express.js               |
| Database   | SQLite3                           |
| Routing    | React Router DOM v6               |
| Icons      | Lucide React                      |

---

## Project Structure

```
dbms_project-main/
├── db/
│   ├── schema.sql        # All CREATE TABLE statements + seed data
│   └── queries.sql       # All SQL queries used by the backend
├── backend/
│   ├── server.js         # Express server — loads schema & queries dynamically
│   ├── reset_db.js       # Utility to reset/reinitialize the database
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Menu.jsx       # Menu browsing & order placement
│   │   │   ├── Orders.jsx     # View & complete active orders
│   │   │   ├── Checkout.jsx   # Bill generation & payment
│   │   │   └── Dashboard.jsx  # Revenue summary & activity logs
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── database.sqlite       # Auto-generated SQLite database file
```

---

## Database Schema

The database consists of **5 tables**:

| Table        | Description                                      |
|--------------|--------------------------------------------------|
| `Categories` | Menu categories (e.g., South Indian, Desserts)  |
| `MenuItems`  | Food items with price, linked to a category      |
| `Orders`     | Customer orders with table number & status       |
| `OrderItems` | Line items linking orders to menu items          |
| `Bills`      | Generated bills with total amount & timestamp    |

### Relationships

```
Categories ──< MenuItems ──< OrderItems >── Orders ──< Bills
```

- Order status can be: `Pending`, `Completed`, or `Cancelled`
- All timestamps are in **IST (UTC+5:30)**
- Prices are in **Indian Rupees (₹)**

---

## API Endpoints

| Method | Endpoint                    | Description                              |
|--------|-----------------------------|------------------------------------------|
| GET    | `/api/menu`                 | Fetch all menu items with categories     |
| POST   | `/api/orders`               | Place a new order                        |
| GET    | `/api/orders`               | Get all active (Pending) orders          |
| GET    | `/api/orders/:id`           | Get full details of a specific order     |
| PUT    | `/api/orders/:id/complete`  | Mark order as Completed & generate bill  |
| GET    | `/api/summary`              | Get total revenue & bill count           |
| GET    | `/api/logs`                 | Get recent orders & bill activity logs   |

> **Note:** A 5% GST is automatically calculated and added when a bill is generated.

---

## Features

- ✅ **Category-based Menu** — Browse items across 5 Indian cuisine categories
- ✅ **Order Placement** — Select items, set quantity, assign a table number
- ✅ **Order Management** — View all pending orders and mark them as complete
- ✅ **Bill Generation** — Auto-calculates subtotal + 5% GST = grand total
- ✅ **Dashboard** — Real-time revenue summary and activity log toggle
- ✅ **Schema-first Architecture** — All SQL in `/db`, loaded dynamically by the server
- ✅ **Indian Localization** — Prices in ₹, timestamps in IST (dd/mm/yyyy)

---

## Menu Categories

| Category     | Sample Items                                      |
|--------------|---------------------------------------------------|
| Appetizers   | Paneer Tikka, Gobi 65, Chilli Paneer              |
| South Indian | Masala Dosa, Idli Vada Combo, South Indian Thali  |
| North Indian | Butter Chicken, Dal Makhani, Vegetable Biryani    |
| Desserts     | Gulab Jamun, Rasmalai, Moong Dal Halwa            |
| Beverages    | Mango Lassi, Filter Coffee, Masala Chai           |

---

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm

### 1. Clone / Download the project

```bash
cd dbms_project-main
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Running the Application

### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend runs on **http://localhost:5000**

> The server auto-initializes the SQLite database from `db/schema.sql` on first run.

### Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend runs on **http://localhost:5173**

### Reset the Database (optional)

To wipe and reinitialize the database with fresh seed data:

```bash
cd backend
node reset_db.js
```

---

## Notes for DBMS Course

- All SQL queries are stored in [`db/queries.sql`](db/queries.sql) — **no raw SQL is hardcoded** in `server.js`
- The server dynamically parses `queries.sql` using comment-based naming conventions
- The schema in [`db/schema.sql`](db/schema.sql) includes both DDL (table definitions) and DML (seed data inserts)
- Foreign key relationships enforce referential integrity across all tables
- `INSERT OR IGNORE` is used for idempotent seed data insertion

---

*Built as a DBMS Project — Snack n Joy © 2026*
