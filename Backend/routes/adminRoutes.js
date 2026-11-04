
const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getRegistrations,
} = require("../controllers/adminController");

const protectAdmin = require("../middleware/authMiddleware");

router.post("/login", adminLogin);
router.get("/registrations", protectAdmin, getRegistrations);

module.exports = router;
