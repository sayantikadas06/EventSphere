
const Event = require("../models/Event");

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch events",
    });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, date, description, capacity } = req.body;

    const event = await Event.create({
      title,
      date,
      description,
      capacity,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create event",
    });
  }
};

