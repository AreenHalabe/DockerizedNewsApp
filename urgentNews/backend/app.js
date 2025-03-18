const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database('./news.db');

// Ensure the table exists and is populated
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS News (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )
    `);

    db.all("SELECT COUNT(*) AS count FROM News", (err, rows) => {
        if (err) {
            console.error("Error counting rows:", err.message);
            return;
        }

        if (rows[0].count === 0) {
            const news = [
                ['Breaking News 1', 'Content of breaking news 1'],
                ['Breaking News 2', 'Content of breaking news 2'],
                ['Breaking News 3', 'Content of breaking news 3'],
                ['Breaking News 4', 'Content of breaking news 4'],
                ['Breaking News 5', 'Content of breaking news 5'],
                ['Breaking News 6', 'Content of breaking news 6'],
                ['Breaking News 7', 'Content of breaking news 7'],
                ['Breaking News 8', 'Content of breaking news 8'],
                ['Breaking News 9', 'Content of breaking news 9'],
                ['Breaking News 10', 'Content of breaking news 10']
            ];

            const insertStmt = db.prepare("INSERT INTO News (title, content) VALUES (?, ?)");
            news.forEach(([title, content]) => {
                insertStmt.run(title, content);
            });
            insertStmt.finalize();
            console.log("Inserted news articles into the database.");
        } else {
            console.log("News table already populated.");
        }
    });
});

// API to get urgent news
app.get('/getUrgentNews', (req, res) => {
    db.all('SELECT * FROM News', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
