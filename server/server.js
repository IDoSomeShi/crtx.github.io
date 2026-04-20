const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ===== DATABASE (temporary in-memory) =====
let users = [];
let modules = [];

// ===== AUTH =====
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: "User exists" });
  }

  const user = {
    username,
    password,
    role: "admin" // you = admin for now
  };

  users.push(user);

  res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid login" });
  }

  res.json({
    success: true,
    role: user.role
  });
});

// ===== MODULES =====
app.get("/api/modules", (req, res) => {
  res.json(modules);
});

app.post("/api/modules/install", (req, res) => {
  const { name } = req.body;

  if (!modules.find(m => m.name === name)) {
    modules.push({ name, enabled: true });
  }

  res.json({ success: true });
});

app.post("/api/modules/toggle", (req, res) => {
  const { name } = req.body;

  modules = modules.map(m =>
    m.name === name ? { ...m, enabled: !m.enabled } : m
  );

  res.json({ success: true });
});

// ===== START SERVER =====
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});