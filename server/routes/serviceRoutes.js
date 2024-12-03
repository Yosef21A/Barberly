const express = require("express");
const router = express.Router();
const { getServices, addService, deleteService } = require("../controllers/serviceController");
const { authenticate } = require("../middleware/authMiddleware");

// Get All Services for a Barber
router.get("/:barberId", getServices);

// Add a New Service (Barber Only)
router.post("/", authenticate, addService);

// Delete a Service (Barber Only)
router.delete("/:id", authenticate, deleteService);

module.exports = router;
