const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const db = new sqlite3.Database("database.sqlite");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Buat tabel jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    message TEXT
)`);

// Route: simpan data
app.post("/submit", (req, res) => {
    const { name, message } = req.body;
    db.run(`INSERT INTO guestbook (name, message) VALUES (?, ?)`, [name, message], err => {
        if (err) {
            return res.status(500).send("Gagal menyimpan data");
        }
        res.redirect("/");
    });
});

// Route: ambil data & kirim ke frontend
app.get("/messages", (req, res) => {
    db.all(`SELECT * FROM guestbook ORDER BY id DESC`, (err, rows) => {
        if (err) {
            return res.status(500).send("Gagal mengambil data");
        }
        res.json(rows);
    });
});

app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));
