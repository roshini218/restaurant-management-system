-- Database Schema for Restaurant Management System

CREATE TABLE IF NOT EXISTS Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS MenuItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    UNIQUE(category_id, name),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_number INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Completed', 'Cancelled'
    created_at DATETIME DEFAULT (datetime('now', '+5 hours', '30 minutes'))
);

CREATE TABLE IF NOT EXISTS OrderItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    menu_item_id INTEGER,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES MenuItems(id)
);

CREATE TABLE IF NOT EXISTS Bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER UNIQUE,
    total_amount REAL NOT NULL,
    paid_at DATETIME DEFAULT (datetime('now', '+5 hours', '30 minutes')),
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);

-- Seed Data for Categories
INSERT OR IGNORE INTO Categories (name) VALUES ('Appetizers'), ('South Indian'), ('North Indian'), ('Desserts'), ('Beverages');

-- Seed Data for MenuItems (Assuming IDs: 1=Appetizers, 2=South Indian, 3=North Indian, 4=Desserts, 5=Beverages)
-- Wait, let's use a cleaner insert that selects the category ID
INSERT OR IGNORE INTO MenuItems (category_id, name, price) VALUES 
((SELECT id FROM Categories WHERE name='Appetizers'), 'Paneer Tikka', 250),
((SELECT id FROM Categories WHERE name='Appetizers'), 'Vegetable Samosa (2 pcs)', 80),
((SELECT id FROM Categories WHERE name='Appetizers'), 'Hara Bhara Kebab', 220),
((SELECT id FROM Categories WHERE name='Appetizers'), 'Chilli Paneer', 280),
((SELECT id FROM Categories WHERE name='Appetizers'), 'Gobi 65', 200),
((SELECT id FROM Categories WHERE name='Appetizers'), 'Cheese Corn Balls', 240),

((SELECT id FROM Categories WHERE name='South Indian'), 'Masala Dosa', 150),
((SELECT id FROM Categories WHERE name='South Indian'), 'Idli Vada Combo', 120),
((SELECT id FROM Categories WHERE name='South Indian'), 'Ven Pongal', 130),
((SELECT id FROM Categories WHERE name='South Indian'), 'Bisi Bele Bath', 110),
((SELECT id FROM Categories WHERE name='South Indian'), 'Mini Podi Idli', 110),
((SELECT id FROM Categories WHERE name='South Indian'), 'South indian thali', 450),

((SELECT id FROM Categories WHERE name='North Indian'), 'Butter Chicken', 350),
((SELECT id FROM Categories WHERE name='North Indian'), 'Dal Makhani', 220),
((SELECT id FROM Categories WHERE name='North Indian'), 'Paneer Butter Masala', 280),
((SELECT id FROM Categories WHERE name='North Indian'), 'Amritsari Kulcha', 90),
((SELECT id FROM Categories WHERE name='North Indian'), 'Tandoori Roti', 50),
((SELECT id FROM Categories WHERE name='North Indian'), 'Vegetable Biryani', 250),
((SELECT id FROM Categories WHERE name='North Indian'), 'North Indian Thali', 510),

((SELECT id FROM Categories WHERE name='Desserts'), 'Gulab Jamun (2 pcs)', 90),
((SELECT id FROM Categories WHERE name='Desserts'), 'Rasmalai (2 pcs)', 120),
((SELECT id FROM Categories WHERE name='Desserts'), 'Moong Dal Halwa', 150),
((SELECT id FROM Categories WHERE name='Desserts'), 'Besan Laddu', 80),
((SELECT id FROM Categories WHERE name='Desserts'), 'Kheer', 100),

((SELECT id FROM Categories WHERE name='Beverages'), 'Falooda', 160),
((SELECT id FROM Categories WHERE name='Beverages'), 'Mango Lassi', 100),
((SELECT id FROM Categories WHERE name='Beverages'), 'Masala Chai', 50),
((SELECT id FROM Categories WHERE name='Beverages'), 'Filter Coffee', 60),
((SELECT id FROM Categories WHERE name='Beverages'), 'Buttermilk (Chaas)', 70),
((SELECT id FROM Categories WHERE name='Beverages'), 'Fresh Lime Soda', 80);

