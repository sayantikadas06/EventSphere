
const express = require("express");
const router = express.Router();

const {
  getEvents,
  createEvent,
} = require("../controllers/eventController");

const protectAdmin = require("../middleware/authMiddleware");

router.get("/", getEvents);
router.post("/", protectAdmin, createEvent);

module.exports = router;
