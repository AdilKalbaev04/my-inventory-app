const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/api/items", upload.single("image"), async (req, res) => {
  const { name, details } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const query =
      "INSERT INTO items(name, details, image_url) VALUES($1, $2, $3) RETURNING *";
    const values = [name, details, imageUrl];

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
