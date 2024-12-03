const Appointment = require("../models/Appointment");
const User = require('../models/User'); 
const BarberProfile = require('../models/BarberProfile'); 
exports.bookAppointment = async (req, res) => {
  try {
    const { barber_id, appointment_date, appointment_time } = req.body;

    // Log the request body to verify the data
    console.log("Booking Request:", req.body);

    const today = new Date();
    const appointmentDate = new Date(appointment_date);

    // Check if the appointment date is in the past
    if (appointmentDate < today) {
      return res.status(400).json({ message: "Cannot book an appointment in the past." });
    }

    // Check if there is a conflicting appointment
    const conflictingAppointment = await Appointment.findOne({
      barber_id,
      appointment_date,
      appointment_time,
      status: "Scheduled",
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    const appointment = new Appointment({
      client_id: req.user.id,
      barber_id,
      appointment_date,
      appointment_time,
    });

    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    let query = { status: { $ne: "Canceled" } }; // Exclude canceled appointments

    if (req.user.role === 'Barber') {
      const barberProfile = await BarberProfile.findOne({ user_id: req.user.id });
      query.barber_id = barberProfile._id;
    } else {
      query.client_id = req.user.id;
    }

    const appointments = await Appointment.find(query)
      .populate('barber_id')
      .populate('client_id');

    if (!appointments) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
};
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status: "Canceled" }, 
      { new: true }
    );
    res.status(200).json({ message: "Appointment canceled successfully", appointment });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "Error canceling appointment", error });
  }
};
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { new_date, new_time } = req.body;
    const appointmentId = req.params.id;

    // Check if the new time slot is available
    const conflictingAppointment = await Appointment.findOne({
      barber_id: req.user.barber_id,
      appointment_date: new_date,
      appointment_time: new_time,
      status: "Scheduled",
    });

    if (conflictingAppointment) {
      return res.status(400).json({ message: "Time slot is already booked" });
    }

    // Update the appointment
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { appointment_date: new_date, appointment_time: new_time },
      { new: true }
    );

    res.status(200).json({ message: "Appointment rescheduled successfully", appointment });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Error rescheduling appointment", error });
  }
};
exports.approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { approval_status: "Approved" },
      { new: true }
    );
    res.status(200).json({ message: "Appointment approved successfully", appointment });
  } catch (error) {
    console.error("Error approving appointment:", error);
    res.status(500).json({ message: "Error approving appointment", error });
  }
};

exports.declineAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { approval_status: "Declined", status: "Canceled" },
      { new: true }
    );
    res.status(200).json({ message: "Appointment declined successfully", appointment });
  } catch (error) {
    console.error("Error declining appointment:", error);
    res.status(500).json({ message: "Error declining appointment", error });
  }
};
