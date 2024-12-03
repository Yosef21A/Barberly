const express = require("express");
const router = express.Router();
const { listBarbers, createBarberProfile, updateBarberProfile, getBarberAvailability } = require("../controllers/barberController");
const { authenticate } = require("../middleware/authMiddleware");

// List All Barbers
router.get("/", listBarbers);

// Create Barber Profile (Barber Only)
router.post("/profile", authenticate, createBarberProfile);

// Update Barber Profile (Barber Only)
router.put("/profile", authenticate, updateBarberProfile);

// Get Barber Availability
router.get("/availability", getBarberAvailability);

module.exports = router;
