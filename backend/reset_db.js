const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const schemaPath = path.resolve(__dirname, '../db/schema.sql');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Drop tables to re-initialize
    db.run("DROP TABLE IF EXISTS Bills");
    db.run("DROP TABLE IF EXISTS OrderItems");
    db.run("DROP TABLE IF EXISTS Orders");
    db.run("DROP TABLE IF EXISTS MenuItems");
    db.run("DROP TABLE IF EXISTS Categories");
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) console.error(err);
        else console.log("Database reset and re-seeded successfully with IST defaults");
        db.close();
    });
});
