const express = require("express");
const { Event, Attendee, EventGroup } = require("../models");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Crearea unui eveniment
router.post("/events", authenticateToken, async (req, res) => {
  const { name, startTime, endTime, groupId } = req.body;

  if (!name || !startTime || !endTime) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, startTime, endTime" });
  }

  try {
    console.log("Creating event with data:", {
      name,
      startTime,
      endTime,
      groupId,
    }); // Debugging

    // Generare manuală a codului de acces
    const generateAccessCode = async () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let codeExists = true;
      let code;

      while (codeExists) {
        code = Array.from({ length: 6 }, () =>
          characters.charAt(Math.floor(Math.random() * characters.length))
        ).join("");

        const existingEvent = await Event.findOne({
          where: { accessCode: code },
        });
        codeExists = !!existingEvent;
      }

      return code;
    };

    const accessCode = await generateAccessCode(); // Generare cod acces

    const event = await Event.create({
      name,
      startTime,
      endTime,
      groupId,
      accessCode,
    });

    console.log("Event created successfully:", event);
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Adăugarea unui participant la un eveniment
router.post("/:id/attendees", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const attendee = await Attendee.create({
      name,
      email,
      eventId: id,
    });

    res.status(201).json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Evenimentele la care participă utilizatorul
// Evenimentele la care participă utilizatorul
router.get("/attendees/my-events", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // ID-ul utilizatorului din token

    // Căutăm toți participanții la evenimentele utilizatorului
    const attendees = await Attendee.findAll({
      where: { userId },
      include: [
        {
          model: Event, // Include detalii despre evenimente
          attributes: ["id", "name", "startTime", "endTime", "accessCode"], // Selectăm câmpurile relevante
        },
      ],
    });

    // Adăugăm statusul pentru fiecare eveniment (OPEN sau CLOSED)
    const eventsWithStatus = attendees.map((attendee) => {
      const event = attendee.Event;
      const now = new Date();
      const status =
        now >= new Date(event.startTime) && now <= new Date(event.endTime)
          ? "OPEN"
          : "CLOSED";

      return {
        eventName: event.name,
        startDate: event.startTime,
        endDate: event.endTime,
        status,
      };
    });

    res.json(eventsWithStatus); // Returnează evenimentele cu statusul
  } catch (error) {
    console.error("Error loading my events:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Crearea unui eveniment asociat unui grup de evenimente
router.post("/:groupId/events", authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const { name, startTime, endTime } = req.body;

  // Validare pentru datele cererii
  if (!name || !startTime || !endTime) {
    return res.status(400).json({
      error: "Missing required fields: name, startTime, endTime",
    });
  }

  try {
    const generateAccessCode = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return code;
    };

    const group = await EventGroup.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const event = await Event.create({
      name,
      startTime,
      endTime,
      groupId,
      accessCode: generateAccessCode(),
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.findAll(); // Obține toate evenimentele
    res.json(events); // Returnează evenimentele în format JSON
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Adăugarea unui participant la un eveniment folosind codul de acces
router.post(
  "/events/register/:eventCode",
  authenticateToken,
  async (req, res) => {
    const { eventCode } = req.params;
    const { name, email, username } = req.body; // Extragem numele și emailul din request body

    try {
      // Verifică dacă evenimentul există
      const event = await Event.findOne({ where: { accessCode: eventCode } });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Folosim username-ul ca nume și creăm un email din username
      const attendeeName = username;
      const attendeeEmail = `${username}@email.com`; // Creăm email-ul folosind username-ul

      // Creăm un participant la eveniment
      const attendee = await Attendee.create({
        name: attendeeName,
        email: attendeeEmail,
        userId: req.user.userId, // ID-ul utilizatorului din token
        eventId: event.id,
      });

      res.status(201).json(attendee);
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ error: "Error registering for event" });
    }
  }
);

const { Parser } = require("json2csv"); // Folosim json2csv pentru a genera fișierele CSV

router.get(
  "/attendees/my-events/export-csv",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId; // ID-ul utilizatorului din token

      // Căutăm toți participanții la evenimentele utilizatorului
      const attendees = await Attendee.findAll({
        where: { userId },
        include: [
          {
            model: Event, // Include detalii despre evenimente
            attributes: ["id", "name", "startTime", "endTime", "accessCode"], // Selectăm câmpurile relevante
          },
        ],
      });

      // Adăugăm statusul pentru fiecare eveniment (OPEN sau CLOSED)
      const eventsWithStatus = attendees.map((attendee) => {
        const event = attendee.Event;
        const now = new Date();
        const status =
          now >= new Date(event.startTime) && now <= new Date(event.endTime)
            ? "OPEN"
            : "CLOSED";

        return {
          attendeeName: attendee.name,
          eventName: event.name,
          startDate: event.startTime,
          endDate: event.endTime,
          status,
          accessCode: event.accessCode,
        };
      });

      // Convertim datele într-un format CSV
      const csvParser = new Parser();
      const csv = csvParser.parse(eventsWithStatus);

      // Setăm răspunsul pentru a trimite fișierul CSV
      res.header("Content-Type", "text/csv");
      res.attachment("my-events.csv");
      res.send(csv); // Trimitem fișierul CSV
    } catch (error) {
      console.error("Error exporting events to CSV:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/events/export-created-events",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.userId; // Obținem ID-ul utilizatorului din token

      // Căutăm grupurile de evenimente create de utilizator
      const eventGroups = await EventGroup.findAll({
        where: { userId }, // Căutăm grupurile de evenimente create de utilizator
        include: [
          {
            model: Event, // Include evenimentele asociate grupului
            attributes: ["id", "name", "startTime", "endTime", "accessCode"], // Selectăm câmpurile relevante ale evenimentelor
          },
        ],
      });

      // Extragem evenimentele din grupuri
      const events = [];
      eventGroups.forEach((group) => {
        group.Events.forEach((event) => {
          events.push({
            eventName: event.name,
            startDate: event.startTime,
            endDate: event.endTime,
            groupName: group.name, // Numele grupului de evenimente
            status:
              new Date() >= new Date(event.startTime) &&
              new Date() <= new Date(event.endTime)
                ? "OPEN"
                : "CLOSED",
          });
        });
      });

      if (events.length === 0) {
        return res.status(404).json({ error: "No events found for the user" });
      }

      // Transformăm datele în CSV
      const csv = new Parser().parse(events);

      // Setăm anteturile pentru a indica un fișier CSV
      res.header("Content-Type", "text/csv");
      res.attachment("events.csv");
      res.send(csv); // Trimitem fișierul CSV
    } catch (error) {
      console.error("Error exporting created events:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/events/export-all-with-attendees",
  authenticateToken,
  async (req, res) => {
    try {
      // Căutăm toate grupurile de evenimente și includem evenimentele și participanții lor
      const eventGroups = await EventGroup.findAll({
        include: [
          {
            model: Event,
            attributes: ["id", "name", "startTime"], // Selectăm câmpurile relevante
            include: [
              {
                model: Attendee, // Include participanții
                attributes: ["name", "createdAt"], // Afișează numele participantului și data înregistrării
              },
            ],
          },
        ],
      });

      const eventsWithAttendees = [];

      // Extragem detalii pentru fiecare eveniment și participanții lor
      eventGroups.forEach((group) => {
        group.Events.forEach((event) => {
          event.Attendees.forEach((attendee) => {
            eventsWithAttendees.push({
              groupName: group.name, // Numele grupului
              eventName: event.name, // Numele evenimentului
              startDate: event.startTime, // Data de început a evenimentului
              attendeeName: attendee.name, // Numele participantului
              attendeeRegisterDate: attendee.createdAt, // Data înregistrării participantului
            });
          });
        });
      });

      if (eventsWithAttendees.length === 0) {
        return res.status(404).json({ error: "No events or attendees found" });
      }

      // Configurăm CSV-ul cu separatorul `;`
      const csv = new Parser({ delimiter: ";" }).parse(eventsWithAttendees);

      // Setăm anteturile pentru fișierul CSV
      res.header("Content-Type", "text/csv");
      res.attachment("events_with_attendees.csv"); // Numele fișierului exportat
      res.send(csv); // Trimitem fișierul CSV
    } catch (error) {
      console.error("Error exporting events with attendees:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
);

// router.get("/", async (req, res) => {
//     try {
//       const events = await Event.findAll();
//       res.json(events);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

module.exports = router;
