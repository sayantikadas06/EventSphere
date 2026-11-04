
require("dotenv").config();

const mongoose = require("mongoose");
const Event = require("./models/Event");

const seedEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const count = await Event.countDocuments();

    if (count > 0) {
      console.log("Events already exist");
      return;
    }

    await Event.insertMany([
      {
        title: "Web Development Workshop",
        date: new Date("2026-11-15"),
        description: "Learn the basics of web development.",
        capacity: 50,
      },
      {
        title: "AI and Machine Learning",
        date: new Date("2026-11-20"),
        description: "Explore the world of artificial intelligence.",
        capacity: 30,
      },
    ]);

    console.log("Sample events added successfully");

  } catch (error) {
    console.log("Error adding events:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedEvents();
