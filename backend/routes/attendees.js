const express = require('express');
const { Attendee, Event } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.get('/my-events', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const attendees = await Attendee.findAll({
      where: { userId },
      include: [{ model: Event }],
    });
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
