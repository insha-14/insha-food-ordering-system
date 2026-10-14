

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "insha_foods",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// READ: Get all foods
app.get("/api/foods", async (req, res) => {
    try {
        const [foods] = await pool.query("SELECT * FROM foods");
        res.json(foods);
    } catch (error) {
        res.status(500).json({ error: "Could not retrieve foods" });
    }
});

// CREATE: Add a food
app.post("/api/foods", async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        if (!name || !category || price === undefined ||
            price === "" || !Number.isFinite(Number(price)) ||
            Number(price) < 0) {
            return res.status(400).json({
                error: "Enter a valid name, category, and price"
            });
        }

        const [result] = await pool.execute(
            `INSERT INTO foods
            (name, category, price, description)
            VALUES (?, ?, ?, ?)`,
            [name, category, Number(price), description || ""]
        );

        res.status(201).json({
            message: "Food added successfully",
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: "Could not add food" });
    }
});

// UPDATE: Edit a food
app.put("/api/foods/:id", async (req, res) => {
    try {
        const { name, category, price, description, availability } = req.body;

        if (!name || !category || price === undefined ||
            price === "" || !Number.isFinite(Number(price)) ||
            Number(price) < 0) {
            return res.status(400).json({
                error: "Enter a valid name, category, and price"
            });
        }

        const [result] = await pool.execute(
            `UPDATE foods
             SET name = ?, category = ?, price = ?,
                 description = ?, availability = ?
             WHERE id = ?`,
            [
                name,
                category,
                Number(price),
                description || "",
                availability === false || availability === 0 ? 0 : 1,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Food not found" });
        }

        res.json({ message: "Food updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not update food" });
    }
});

// DELETE: Remove a food
app.delete("/api/foods/:id", async (req, res) => {
    try {
        const [result] = await pool.execute(
            "DELETE FROM foods WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Food not found" });
        }

        res.json({ message: "Food deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Could not delete food" });
    }
});

// Start server after checking the database connection
async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log("MySQL connected successfully!");
        connection.release();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Website running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MySQL connection failed:", error.message);
        process.exit(1);
    }
}

startServer();