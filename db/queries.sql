-- Queries for Restaurant Management System Backend

-- Get all menu items with categories
SELECT m.id, m.name, m.price, c.name as category 
FROM MenuItems m 
JOIN Categories c ON m.category_id = c.id;

-- Create an order
INSERT INTO Orders (table_number, status) VALUES (?, 'Pending');

-- Add items to order
INSERT INTO OrderItems (order_id, menu_item_id, quantity) VALUES (?, ?, ?);

-- Get order details by ID
SELECT o.id, o.table_number, o.status, m.name, m.price, oi.quantity, (m.price * oi.quantity) as subtotal
FROM Orders o
JOIN OrderItems oi ON o.id = oi.order_id
JOIN MenuItems m ON oi.menu_item_id = m.id
WHERE o.id = ?;

-- Get all active (Pending) orders
SELECT o.id, o.table_number, o.status, o.created_at, SUM(m.price * oi.quantity) as total
FROM Orders o
JOIN OrderItems oi ON o.id = oi.order_id
JOIN MenuItems m ON oi.menu_item_id = m.id
WHERE o.status = 'Pending'
GROUP BY o.id
ORDER BY o.created_at DESC;

-- Update order status
UPDATE Orders SET status = ? WHERE id = ?;

-- Generate Bill
INSERT INTO Bills (order_id, total_amount) VALUES (?, ?);

-- Get Bill Details
SELECT b.id as bill_id, b.total_amount, b.paid_at, o.table_number
FROM Bills b
JOIN Orders o ON b.order_id = o.id
WHERE b.order_id = ?;

-- Get Total Revenue Summary
SELECT SUM(total_amount) as total_revenue, COUNT(id) as total_bills FROM Bills;

-- Get logs (Recent Orders/Bills for the UI Toggle feature)
SELECT 'Order Placed' as event, 'Table ' || table_number || ' - Status: ' || status as details, created_at as timestamp FROM Orders
UNION ALL
SELECT 'Bill Generated' as event, 'Order ID: ' || order_id || ' - Amount: ₹' || total_amount as details, paid_at as timestamp FROM Bills
ORDER BY timestamp DESC LIMIT 20;
