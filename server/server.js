const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "inventory_app",
  password: "qwerty",
  port: 5432,
});

app.use(cors());
app.use(express.json());

app.post("/api/items", async (req, res) => {
  const { name, details } = req.body;

  try {
    const query = "INSERT INTO items(name, details) VALUES($1, $2) RETURNING *";
    const values = [name, details];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Error adding item");
  }
});

app.get("/api/items", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Error fetching items");
  }
});

app.delete("/api/items/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    const query = "DELETE FROM items WHERE id = $1";
    const values = [itemId];

    await pool.query(query, values);
    res.sendStatus(204);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Error deleting item");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
