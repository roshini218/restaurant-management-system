# 🍽️ Regal Crest — Restaurant Management System
## Complete DBMS Mini-Project Explanation Guide

---

## 📁 PART 1: PROJECT STRUCTURE — WHAT IS WHERE

```
FinalRes-main/
└── restaurant-main/
    ├── database.sqlite       ← The actual database file (SQLite)
    ├── .gitignore            ← Tells Git which files/folders to ignore
    ├── db/
    │   ├── schema.sql        ← Table definitions (CREATE TABLE)
    │   └── queries.sql       ← All SQL queries used by the backend
    ├── backend/
    │   ├── server.js         ← The Node.js/Express API server (brain of backend)
    │   ├── reset_db.js       ← Utility to wipe and re-seed the database
    │   └── package.json      ← Backend dependencies list
    └── frontend/
        ├── index.html        ← Single HTML entry point
        ├── vite.config.js    ← Vite bundler configuration
        ├── tailwind.config.js← TailwindCSS design tokens
        ├── postcss.config.js ← PostCSS (needed for Tailwind)
        ├── package.json      ← Frontend dependencies list
        └── src/
            ├── main.jsx      ← React app bootstrap/entry point
            ├── App.jsx       ← Root component, navigation, layout
            ├── index.css     ← Global styles + Tailwind base
            └── pages/
                ├── Dashboard.jsx ← Business stats + system logs
                ├── Menu.jsx      ← Food menu + cart + order placement
                ├── Orders.jsx    ← Live kitchen queue view
                └── Checkout.jsx  ← Bill lookup + receipt printing
```

---

## 📚 PART 2: TECHNOLOGY STACK — WHAT AND WHY

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Database** | SQLite | Lightweight file-based relational DB, no server needed |
| **Backend** | Node.js + Express | REST API server handling all business logic |
| **Frontend** | React (Vite) | Dynamic UI with component-based architecture |
| **Styling** | TailwindCSS | Utility-first CSS framework for fast styling |
| **HTTP Client** | Axios | Makes HTTP requests from frontend to backend |
| **Routing** | React Router DOM | Client-side navigation between pages |
| **Icons** | Lucide React | Clean SVG icon library |

### Why SQLite?
SQLite stores everything in a single file (`database.sqlite`). Perfect for a mini-project because it needs zero installation, zero configuration, and runs everywhere.

---

## 🗃️ PART 3: DATABASE SCHEMA (schema.sql) — THE FOUNDATION

This is the most important DBMS concept. The schema defines the **structure** of the database.

### Table 1: `Categories`
```sql
CREATE TABLE IF NOT EXISTS Categories (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
```
- Stores food categories: **Appetizers, South Indian, North Indian, Desserts, Beverages**
- `AUTOINCREMENT` → ID is assigned automatically (1, 2, 3...)
- `UNIQUE` → No two categories can have the same name

### Table 2: `MenuItems`
```sql
CREATE TABLE IF NOT EXISTS MenuItems (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name        TEXT NOT NULL,
    price       REAL NOT NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);
```
- Stores individual dishes with price in ₹
- `category_id` is a **FOREIGN KEY** → links each item to its category
- `REAL` datatype → allows decimal prices (e.g., ₹150.00)

### Table 3: `Orders`
```sql
CREATE TABLE IF NOT EXISTS Orders (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number INTEGER NOT NULL,
    status       TEXT NOT NULL DEFAULT 'Pending',
    created_at   DATETIME DEFAULT (datetime('now', '+5 hours', '30 minutes'))
);
```
- Records every order placed
- `status` starts as `'Pending'` and becomes `'Completed'`
- `created_at` uses IST (Indian Standard Time = UTC+5:30)

### Table 4: `OrderItems`
```sql
CREATE TABLE IF NOT EXISTS OrderItems (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER,
    menu_item_id INTEGER,
    quantity     INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id)     REFERENCES Orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES MenuItems(id)
);
```
- This is the **junction/bridge table** — it links Orders to MenuItems
- Stores which items were ordered and how many (quantity)
- Has TWO foreign keys → classic many-to-many relationship resolution

### Table 5: `Bills`
```sql
CREATE TABLE IF NOT EXISTS Bills (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id     INTEGER UNIQUE,
    total_amount REAL NOT NULL,
    paid_at      DATETIME DEFAULT (datetime('now', '+5 hours', '30 minutes')),
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);
```
- Generated when an order is marked complete
- `order_id UNIQUE` → one bill per order (one-to-one relationship)
- `total_amount` includes GST

### Entity-Relationship Summary

```
Categories ──< MenuItems >── OrderItems >── Orders ──< Bills
   (1)           (many)        (many)         (1)       (1)
```

---

## 💾 PART 4: SQL QUERIES (queries.sql) — HOW DATA IS FETCHED

All queries are stored in one file and loaded by the backend at startup.

### Query 1: Get All Menu Items with Category Name
```sql
SELECT m.id, m.name, m.price, c.name as category 
FROM MenuItems m 
JOIN Categories c ON m.category_id = c.id;
```
- Uses `INNER JOIN` to combine MenuItems and Categories
- `c.name as category` → renames column for frontend use

### Query 2: Create an Order
```sql
INSERT INTO Orders (table_number, status) VALUES (?, 'Pending');
```
- `?` is a parameterized placeholder → prevents SQL injection
- Status always starts as 'Pending'

### Query 3: Add Items to Order
```sql
INSERT INTO OrderItems (order_id, menu_item_id, quantity) VALUES (?, ?, ?);
```
- Called once per item in the cart
- Three parameters: which order, which menu item, how many

### Query 4: Get Order Details by ID
```sql
SELECT o.id, o.table_number, o.status, m.name, m.price, 
       oi.quantity, (m.price * oi.quantity) as subtotal
FROM Orders o
JOIN OrderItems oi ON o.id = oi.order_id
JOIN MenuItems m  ON oi.menu_item_id = m.id
WHERE o.id = ?;
```
- Triple JOIN across 3 tables
- Calculates `subtotal` per item using arithmetic in SQL

### Query 5: Get All Pending Orders
```sql
SELECT o.id, o.table_number, o.status, o.created_at, 
       SUM(m.price * oi.quantity) as total
FROM Orders o
JOIN OrderItems oi ON o.id = oi.order_id
JOIN MenuItems m   ON oi.menu_item_id = m.id
WHERE o.status = 'Pending'
GROUP BY o.id
ORDER BY o.created_at DESC;
```
- Uses `SUM()` aggregate function + `GROUP BY` to get total per order
- `ORDER BY created_at DESC` → newest orders first

### Query 6: Update Order Status
```sql
UPDATE Orders SET status = ? WHERE id = ?;
```
- Changes status from 'Pending' to 'Completed'

### Query 7: Generate Bill
```sql
INSERT INTO Bills (order_id, total_amount) VALUES (?, ?);
```
- Creates a bill record with grand total (subtotal + 5% GST)

### Query 8: Revenue Summary
```sql
SELECT SUM(total_amount) as total_revenue, COUNT(id) as total_bills 
FROM Bills;
```
- Uses `SUM()` and `COUNT()` aggregates for the Dashboard

### Query 9: System Logs (UNION)
```sql
SELECT 'Order Placed' as event, 'Table '||table_number||' - Status: '||status as details, 
       created_at as timestamp FROM Orders
UNION ALL
SELECT 'Bill Generated' as event, 'Order ID: '||order_id||' - Amount: ₹'||total_amount, 
       paid_at FROM Bills
ORDER BY timestamp DESC LIMIT 20;
```
- Uses `UNION ALL` to combine two tables into one result
- `||` is SQLite's string concatenation operator
- Shows last 20 events sorted newest first

---

## ⚙️ PART 5: BACKEND (server.js) — THE API SERVER

The backend is a **Node.js** server using the **Express** framework.

### Startup Sequence
1. `require('express')` → load the web framework
2. `app.use(cors())` → allow the frontend (port 5173) to call this API (port 5000)
3. Connect to `database.sqlite`
4. Run `initDb()` → executes `schema.sql` (CREATE TABLE IF NOT EXISTS — safe to run multiple times)
5. Run `loadQueries()` → reads `queries.sql` and parses each named block into a dictionary
6. Start listening on **port 5000**

### How Queries Are Loaded (Smart Parsing)
```js
const blocks = content.split('-- ').filter(b => b.trim().length > 0);
blocks.forEach(block => {
    const lines = block.split('\n');
    const name = lines[0].trim()... // "Get all menu items" → "get_all_menu_items"
    const sql = lines.slice(1).join('\n').trim(); // actual SQL
    queries[name] = sql;
});
```
The comment before each query (e.g., `-- Get all menu items with categories`) becomes the key name in the `queries` object.

### Helper Functions (Promise Wrappers)
```js
runQuery()  // for INSERT / UPDATE (returns lastID)
allQuery()  // for SELECT returning multiple rows
getQuery()  // for SELECT returning one row
```
These wrap SQLite callbacks into Promises for use with `async/await`.

### REST API Endpoints

| Method | URL | Action |
|--------|-----|--------|
| GET | `/api/menu` | Fetch all menu items with categories |
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders` | Get all pending orders |
| GET | `/api/orders/:id` | Get details of one order |
| PUT | `/api/orders/:id/complete` | Mark order complete + generate bill |
| GET | `/api/summary` | Get total revenue and bill count |
| GET | `/api/logs` | Get recent system logs |

### Complete Order Flow (PUT /api/orders/:id/complete)
```js
1. UPDATE Orders SET status = 'Completed' WHERE id = ?
2. SELECT all items for this order (with price × qty = subtotal)
3. Calculate: subtotal = sum of all subtotals
4. gst = subtotal × 0.05  (5%)
5. grandTotal = subtotal + gst
6. INSERT INTO Bills (order_id, grandTotal)
7. Return: { billId, subtotal, gst, grandTotal }
```

---

## ⚛️ PART 6: FRONTEND — REACT APPLICATION

### index.html — The Shell
- Single HTML file with `<div id="root">` — React mounts here
- Loads Google Fonts: **Cinzel** (royal headings), **Cormorant Garamond** (serif), **Inter** (body text)
- The `<script type="module" src="/src/main.jsx">` loads the entire React app

### main.jsx — Bootstrap
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```
- Wraps the entire app in `BrowserRouter` (enables client-side routing)
- Renders `App` into the `#root` div

### App.jsx — Layout + Navigation
- Renders the decorative header with "Regal Crest" branding
- Contains a pill-style navigation bar with 4 links
- Uses `useLocation()` to highlight the active nav link
- `<Routes>` maps URL paths to page components:
  - `/` → Dashboard
  - `/menu` → Menu
  - `/orders` → Orders (Live Kitchen Queue)
  - `/checkout` → Checkout

### tailwind.config.js — Design System
Custom color palette:
- `cream` (#fdfbf7) — warm white background
- `forest` (#1c3016) — dark green for text/buttons
- `gold` (#D4AF37) — accent gold color
- Font families: `royal` (Cinzel), `serif` (Cormorant), `sans` (Inter)

### index.css — Global Styles
- Imports Tailwind base/components/utilities
- `.glass` — glassmorphism utility (frosted-glass effect)
- `.royal-corner` — decorative corner borders on the 4 screen edges
- `.custom-scrollbar` — styled gold scrollbar for dark panels

---

## 📄 PART 7: PAGE-BY-PAGE BREAKDOWN

### Dashboard.jsx
**Purpose:** Business analytics overview

**What it fetches:**
- `GET /api/summary` → total revenue, total bills
- `GET /api/logs` → recent activity logs

**What it displays:**
1. **Total Revenue** card — sum of all bill amounts
2. **Total Bills Generated** card — count of completed orders
3. **Average Order Value** card — revenue ÷ bills
4. **Live System Logs** panel — shows both "Order Placed" and "Bill Generated" events using UNION ALL query

**React concepts used:** `useState`, `useEffect`, `axios.get`

---

### Menu.jsx
**Purpose:** Browse menu and place orders

**State variables:**
- `menuItems` — array of all dishes from API
- `cart` — array of items added by user
- `tableNumber` — which table is ordering (default: 1)

**How cart works:**
- `addToCart(item)` → if item exists, increment quantity; else add new entry
- `removeFromCart(id)` → if quantity > 1, decrement; else remove entirely
- Cart shows in sidebar with subtotal, 5% GST, and grand total in real-time

**Order placement:**
```js
POST /api/orders  with body:
{
  table_number: 3,
  items: [
    { menu_item_id: 7, quantity: 1 },
    { menu_item_id: 1, quantity: 2 }
  ]
}
```
On success: cart is cleared, success alert shown.

---

### Orders.jsx (Live Kitchen Queue)
**Purpose:** Kitchen staff view of all pending orders

**Key feature:** **Auto-polling every 5 seconds**
```js
const interval = setInterval(fetchOrders, 5000);
return () => clearInterval(interval); // cleanup on unmount
```

This keeps the kitchen queue updated automatically without page refresh.

**Each order card shows:** Table number, Order ID, time, status badge, total amount

**Mark Ready button:** Calls `PUT /api/orders/:id/complete` which:
1. Updates status to 'Completed'
2. Calculates GST
3. Inserts into Bills table
4. Order disappears from the queue

---

### Checkout.jsx
**Purpose:** Bill lookup and receipt printing

**Flow:**
1. Staff enters an Order ID
2. `GET /api/orders/:id` → fetches order items
3. Calculates subtotal from items
4. Displays a receipt with: restaurant name, order/table info, itemized list, GST, grand total
5. "Print Receipt" button calls `window.print()`

---

## 🔗 PART 8: HOW EVERYTHING IS CONNECTED (Data Flow)

```
[Customer at Table]
      ↓
[Frontend: Menu.jsx]
  - Fetches menu from GET /api/menu
  - Customer selects items → cart builds up
  - POST /api/orders → sends table_number + items[]
      ↓
[Backend: server.js]
  - Runs: INSERT INTO Orders (table_number, 'Pending')
  - Runs: INSERT INTO OrderItems (order_id, menu_item_id, qty) for each item
      ↓
[Database: database.sqlite]
  - Orders table gets new row
  - OrderItems table gets new rows (one per dish)
      ↓
[Frontend: Orders.jsx] ← polls every 5 seconds
  - GET /api/orders → shows the pending order
  - Kitchen sees: Table 3, Order #5, ₹520.00
  - Clicks "Mark Ready"
      ↓
[Backend: server.js] (PUT /api/orders/:id/complete)
  - UPDATE Orders SET status = 'Completed'
  - SELECT items → calculate subtotal → add 5% GST
  - INSERT INTO Bills (order_id, grand_total)
      ↓
[Frontend: Checkout.jsx]
  - Staff enters Order ID
  - GET /api/orders/:id → fetch items + subtotal
  - Displays receipt, prints bill
      ↓
[Frontend: Dashboard.jsx]
  - GET /api/summary → updated revenue shown
  - GET /api/logs → new entries visible in logs
```

---

## 🔧 PART 9: HOW TO RUN THE PROJECT

### Step 1 — Start the Backend
```bash
cd restaurant-main/backend
node server.js
# Server starts on http://localhost:5000
# SQLite connects, schema runs, queries load
```

### Step 2 — Start the Frontend
```bash
cd restaurant-main/frontend
npm run dev
# Vite starts on http://localhost:5173
```

### Step 3 — Open Browser
Visit: **http://localhost:5173**

### (Optional) Reset Database
```bash
cd restaurant-main/backend
node reset_db.js
# Drops all tables, re-runs schema, re-seeds menu data
```

---

## ❓ PART 10: TEACHER QUESTIONS & ANSWERS

**Q: What type of database is used and why?**
A: SQLite — a serverless, file-based relational database. Chosen because it requires no separate server installation, stores all data in a single `.sqlite` file, and supports full SQL. Perfect for a self-contained academic project.

**Q: What is a Foreign Key? Where is it used here?**
A: A Foreign Key is a column that references the Primary Key of another table, enforcing referential integrity. Used in: `MenuItems.category_id → Categories.id`, `OrderItems.order_id → Orders.id`, `OrderItems.menu_item_id → MenuItems.id`, `Bills.order_id → Orders.id`.

**Q: What is normalization? Is this project normalized?**
A: Normalization is organizing data to reduce redundancy. This project is in 3NF: Categories are separate (no repeated category names), MenuItems store only the category_id (not the category name), and OrderItems stores just IDs (not item names/prices).

**Q: Explain the JOIN queries used.**
A: Three types: The menu query uses a 2-table JOIN (MenuItems + Categories). The order details and pending orders queries use 3-table JOINs (Orders + OrderItems + MenuItems). JOINs combine rows from multiple tables using matching key values.

**Q: What is CRUD? Show where each operation happens.**
- **Create:** POST /api/orders → INSERT INTO Orders, INSERT INTO OrderItems
- **Read:** GET /api/menu → SELECT from MenuItems JOIN Categories
- **Update:** PUT /api/orders/:id/complete → UPDATE Orders SET status
- **Delete:** No delete in UI (data is preserved for records)

**Q: What does CORS mean? Why is it needed?**
A: Cross-Origin Resource Sharing. The frontend runs on port 5173 and the backend on port 5000 — different origins. Without `app.use(cors())`, the browser blocks these cross-origin requests for security.

**Q: What is the purpose of the `schema.sql` file?**
A: It defines all 5 tables with their columns, data types, constraints (PRIMARY KEY, NOT NULL, UNIQUE, FOREIGN KEY), and seeds initial data. The `CREATE TABLE IF NOT EXISTS` syntax means it's safe to run multiple times without error.

**Q: How is GST calculated in this project?**
A: GST is 5%. When an order is marked complete: `subtotal = sum(price × quantity)` for all items. `gst = subtotal × 0.05`. `grand_total = subtotal + gst`. This is done in the backend (server.js) and stored in the Bills table.

**Q: What is an API? How does the frontend talk to backend?**
A: API (Application Programming Interface) is a set of rules for how programs talk. The frontend uses Axios to make HTTP requests (GET, POST, PUT) to the backend Express server's REST API endpoints. The backend responds with JSON data.

**Q: What is React? Why use it here?**
A: React is a JavaScript library for building user interfaces using components. Each page (Dashboard, Menu, Orders, Checkout) is a separate component. React's `useState` manages local state (cart, orders), `useEffect` fetches data on page load, and React Router handles navigation.

**Q: What is the difference between `runQuery`, `allQuery`, and `getQuery`?**
A: All three are Promise wrappers around SQLite callbacks. `runQuery` is for INSERT/UPDATE (returns `lastID` for newly created rows). `allQuery` is for SELECT returning many rows. `getQuery` is for SELECT returning exactly one row.

**Q: What is the role of `package.json`?**
A: It lists all dependencies (libraries needed), dev dependencies (tools used in development), and npm scripts (commands like `npm run dev`). Running `npm install` reads this file and installs everything in `node_modules/`.

**Q: What is Vite?**
A: Vite is a build tool and development server for modern JavaScript projects. It serves the React app during development with instant hot-module replacement (HMR) and builds an optimized bundle for production. Configured in `vite.config.js`.

**Q: What does `useEffect` with empty `[]` dependency array mean?**
A: It means the effect runs **once** when the component first mounts — equivalent to `componentDidMount` in class components. Used to fetch data from the API when a page first loads.

**Q: What is the UNION ALL query used for?**
A: In `queries.sql`, the logs query uses `UNION ALL` to combine results from the `Orders` table and `Bills` table into a single timeline. `UNION ALL` keeps all rows including duplicates (unlike `UNION` which removes duplicates). This creates the activity feed on the Dashboard.

**Q: How does real-time updating work in Orders page?**
A: It uses **polling** — `setInterval(fetchOrders, 5000)` calls the API every 5 seconds. The cleanup function `clearInterval` stops polling when the component unmounts (navigation away). This gives a real-time feel without WebSockets.

**Q: What is the `.gitignore` file for?**
A: It tells Git to not track certain files. `node_modules/` is excluded (huge folder, reinstalled via `npm install`). `.env` files are excluded (contain secrets). `dist/` is excluded (generated build output).

**Q: What is `INSERT OR IGNORE`? Where is it used?**
A: In `schema.sql`, `INSERT OR IGNORE INTO Categories` — if a row with that name already exists (UNIQUE constraint), the insert is silently skipped instead of throwing an error. This prevents duplicate categories when the schema runs multiple times.

**Q: What is the `reset_db.js` file?**
A: A utility script that drops all tables in reverse order of foreign key dependencies (Bills → OrderItems → Orders → MenuItems → Categories) and re-runs `schema.sql` to create fresh tables with seed data. Used to reset the database to initial state.

---

## 📊 PART 11: DATABASE ER DIAGRAM

```
┌──────────────┐      ┌──────────────────┐
│  Categories  │      │    MenuItems     │
│──────────────│      │──────────────────│
│ id (PK)      │◄─────│ id (PK)          │
│ name         │      │ category_id (FK) │
└──────────────┘      │ name             │
                      │ price            │
                      └────────┬─────────┘
                               │
                      ┌────────▼─────────┐
                      │   OrderItems     │
                      │──────────────────│
                      │ id (PK)          │
              ┌───────│ order_id (FK)    │
              │       │ menu_item_id (FK)│
              │       │ quantity         │
              │       └──────────────────┘
              │
       ┌──────▼───────┐      ┌──────────────┐
       │    Orders    │      │    Bills     │
       │──────────────│      │──────────────│
       │ id (PK)      │◄─────│ id (PK)      │
       │ table_number │      │ order_id(FK) │
       │ status       │      │ total_amount │
       │ created_at   │      │ paid_at      │
       └──────────────┘      └──────────────┘
```

---

## 🎯 PART 12: KEY DBMS CONCEPTS DEMONSTRATED

| Concept | Where Used |
|---------|-----------|
| Primary Key | Every table (id column) |
| Foreign Key | MenuItems, OrderItems, Bills |
| AUTOINCREMENT | All id columns |
| NOT NULL constraint | name, price, table_number, status |
| UNIQUE constraint | Categories.name, Bills.order_id |
| DEFAULT values | Orders.status = 'Pending', created_at |
| INNER JOIN | All SELECT queries combining tables |
| Aggregate functions | SUM(), COUNT() in summary + pending orders |
| GROUP BY | Pending orders query (total per order) |
| ORDER BY | Pending orders (newest first), logs (newest first) |
| UNION ALL | System logs combining Orders + Bills |
| Parameterized queries | All INSERT/UPDATE (? placeholders) |
| Transactions (implicit) | SQLite auto-commits each statement |
| IST Timezone | datetime('now', '+5 hours', '30 minutes') |
| Seed Data | INSERT OR IGNORE for categories + all menu items |

---

























*Document prepared for DBMS Mini-Project: Regal Crest Restaurant Management System*
*Stack: SQLite + Node.js/Express + React (Vite) + TailwindCSS*
