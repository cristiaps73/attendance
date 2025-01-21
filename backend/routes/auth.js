const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();

// Ruta pentru înregistrare
router.post("/api/register", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await db.User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error.message);
      res.status(500).json({ error: "Registration failed" });
    }
  });

// Ruta pentru autentificare
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, "secret_key", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Ruta pentru obținerea tuturor utilizatorilor
router.get('/users', async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'username', 'createdAt', 'updatedAt'], // Selectează doar câmpurile relevante
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
module.exports = router;
