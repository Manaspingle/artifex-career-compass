import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "data", "artifex.db");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "artifex-secret";

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to open DB", err);
    process.exit(1);
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
});

const signToken = (user) => jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Authorization header missing" });
  const token = header.replace("Bearer ", "");
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashed],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(409).json({ message: "Email already registered" });
        }
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      const user = { id: this.lastID, name, email };
      const token = signToken(user);
      return res.status(201).json({ user, token });
    }
  );
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing credentials" });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);
    return res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  db.get("SELECT id, name, email, created_at FROM users WHERE id = ?", [userId], (err, user) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
