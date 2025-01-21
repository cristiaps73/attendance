const express = require("express");
const { EventGroup, Event } = require("../models");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Creare grup de evenimente
router.post("/", authenticateToken, async (req, res) => {
  const { name, repeatInterval } = req.body;

  try {
    const userId = req.user.userId;
    const group = await EventGroup.create({ name, repeatInterval, userId });
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listare grupuri de evenimente pentru utilizator
router.get("/my-groups", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const eventGroups = await EventGroup.findAll({
      where: { userId },
      include: [{ model: Event }],
    });

    res.json(eventGroups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const groups = await EventGroup.findAll({ include: [Event] });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizare grup de evenimente
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, repeatInterval } = req.body;

  try {
    const eventGroup = await EventGroup.findByPk(id);

    if (!eventGroup) {
      return res.status(404).json({ error: "Event group not found" });
    }

    // Actualizează datele grupului
    await eventGroup.update({ name, repeatInterval });
    res.json(eventGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Preia un grup specific de evenimente după ID
router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const group = await EventGroup.findByPk(id, {
      include: [Event], // Include evenimentele asociate
    });

    if (!group) {
      return res.status(404).json({ error: 'Event group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Adaugă un eveniment într-un grup
router.post("/:id/events", authenticateToken, async (req, res) => {
  const { id } = req.params; // ID-ul grupului
  const { name, startTime, endTime } = req.body;

  try {
    const eventGroup = await EventGroup.findByPk(id);

    if (!eventGroup) {
      return res.status(404).json({ error: "Event group not found" });
    }

    // Creează un nou eveniment în grup
    const event = await Event.create({
      name,
      startTime,
      endTime,
      groupId: id,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:groupId/events", authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const { name, startTime, endTime } = req.body;

  try {
      const group = await EventGroup.findByPk(groupId);
      if (!group) {
          return res.status(404).json({ error: "Event group not found" });
      }

      const event = await Event.create({
          name,
          startTime,
          endTime,
          groupId: group.id,
      });

      res.status(201).json(event);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

module.exports = router;
