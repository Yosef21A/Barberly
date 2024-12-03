const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  rescheduleAppointment,  // Add a new route for rescheduling an appointment (Barber Only)
  approveAppointment, ///
  declineAppointment, /// Remove appointment

} = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/authMiddleware");

// Book an Appointment
router.post("/book", authenticate, bookAppointment);

// Get Appointments for a Client
router.get("/", authenticate, getAppointments);

// Cancel an Appointment
router.put("/cancel/:id", authenticate, cancelAppointment);
router.put('/reschedule/:id', authenticate, rescheduleAppointment);
router.put('/approve/:id', approveAppointment); 
router.put('/decline/:id', declineAppointment);
module.exports = router;
