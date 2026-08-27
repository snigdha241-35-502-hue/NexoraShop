const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { users, uuid, now } = require("../data/db");
const { protect } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: "customer",
    createdAt: now(),
  };
  users.push(newUser);

  const token = signToken(newUser);
  res.status(201).json({ token, user: publicUser(newUser) });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || !bcrypt.compareSync(password || "", user.password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
