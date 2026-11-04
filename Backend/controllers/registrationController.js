
const Registration = require("../models/Registration");
const Event = require("../models/Event");

// Register for an event
exports.registerParticipant = async (req, res) => {
  try {
    const { eventId, name, email, college, domainInterest } = req.body;

    // Check required fields
    if (!eventId || !name || !email || !college || !domainInterest) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    // Check whether event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Check available capacity
    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({
        message: "Sorry, this event is full",
      });
    }

    // Check duplicate registration
    const existingRegistration = await Registration.findOne({
      event: eventId,
      email: email.toLowerCase().trim(),
    });

    if (existingRegistration) {
      return res.status(409).json({
        message: "You have already registered for this event",
      });
    }

    // Save registration
    const registration = await Registration.create({
      event: eventId,
      name,
      email,
      college,
      domainInterest,
    });

    // Update registered count
    event.registeredCount += 1;
    await event.save();

    res.status(201).json({
      message: "Registration successful!",
      registration,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already registered for this event",
      });
    }

    res.status(500).json({
      message: "Registration failed",
    });
  }
};
