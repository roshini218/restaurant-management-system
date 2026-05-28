const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Database file path (in the project root)
const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database at', dbPath);
        initDb();
    }
});

// Load Schema and Queries
const schemaPath = path.resolve(__dirname, '../db/schema.sql');
let queries = {};

function loadQueries() {
    const queriesFile = path.resolve(__dirname, '../db/queries.sql');
    if (fs.existsSync(queriesFile)) {
        const content = fs.readFileSync(queriesFile, 'utf8');
        const blocks = content.split('-- ').filter(b => b.trim().length > 0);
        blocks.forEach(block => {
            const lines = block.split('\n');
            const name = lines[0].trim().toLowerCase().replace(/ /g, '_').replace(/[^a-z0-9_]/g, '');
            const sql = lines.slice(1).join('\n').trim();
            if (name && sql) {
                queries[name] = sql;
            }
        });
        console.log('Loaded queries count:', Object.keys(queries).length);
    }
}

function initDb() {
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error initializing schema:', err.message);
            } else {
                console.log('Database schema initialized.');
                loadQueries();
            }
        });
    } else {
        console.error('Schema file not found at', schemaPath);
    }
}

// Helper function to run DB queries as promises
const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};

const allQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

const getQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};


// API Endpoints

app.get('/api/menu', async (req, res) => {
    try {
        const sql = queries['get_all_menu_items_with_categories'];
        const rows = await allQuery(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const { table_number, items } = req.body;
    try {
        const createOrderSql = queries['create_an_order'];
        const result = await runQuery(createOrderSql, [table_number]);
        const orderId = result.lastID;

        const addItemSql = queries['add_items_to_order'];
        for (const item of items) {
            await runQuery(addItemSql, [orderId, item.menu_item_id, item.quantity]);
        }

        res.status(201).json({ message: 'Order created', orderId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const sql = queries['get_all_active_pending_orders'];
        const rows = await allQuery(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const sql = queries['get_order_details_by_id'];
        const rows = await allQuery(sql, [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/orders/:id/complete', async (req, res) => {
    try {
        const completeSql = queries['update_order_status'];
        await runQuery(completeSql, ['Completed', req.params.id]);

        // Get total amount for bill
        const orderDetailsSql = queries['get_order_details_by_id'];
        const items = await allQuery(orderDetailsSql, [req.params.id]);
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const gst = subtotal * 0.05;
        const grandTotal = subtotal + gst;

        // Generate Bill
        const generateBillSql = queries['generate_bill'];
        const billResult = await runQuery(generateBillSql, [req.params.id, grandTotal]);
        
        res.json({ message: 'Order completed and bill generated', billId: billResult.lastID, subtotal, gst, grandTotal });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/summary', async (req, res) => {
    try {
        const sql = queries['get_total_revenue_summary'];
        const summary = await getQuery(sql);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/logs', async (req, res) => {
    try {
        const sql = queries['get_logs_recent_ordersbills_for_the_ui_toggle_feature'];
        const logs = await allQuery(sql);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
