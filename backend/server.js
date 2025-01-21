const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./models"); // Importă modelele Sequelize
const bcrypt = require("bcrypt");

// Importă middleware și rutele
const authenticateToken = require('./middleware/authenticateToken');
const authRoutes = require("./routes/auth");
const eventGroupRoutes = require("./routes/event-groups");
const eventRoutes = require("./routes/events");

const app = express(); // Inițializează aplicația Express

// Middleware-uri
app.use(cors());
app.use(bodyParser.json());

// Rute definite în fișierele de rutare
app.use("/api", authRoutes);
app.use("/api/event-groups", eventGroupRoutes);
app.use("/api", eventRoutes);

// Ruta pentru înregistrare directă (dacă nu folosești auth.js pentru acest scop)
app.post("/api/register", async (req, res) => {
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
    res.status(500).json({ error: "Registration failed" });
  }
});

// Rute pentru evenimente și participanți
app.get("/api/events/:id/attendees", async (req, res) => {
  try {
    const attendees = await db.Attendee.findAll({
      where: { eventId: req.params.id },
    });
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verifică conexiunea la baza de date și pornește serverul
db.sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully."))
  .catch((err) => console.error("Database connection failed:", err));

const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
