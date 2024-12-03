const BarberProfile = require("../models/BarberProfile");
const User = require("../models/User");
const Appointment = require('../models/Appointment');
exports.createBarberProfile = async (req, res) => {
  try {
    const { location, experience, services_offered, working_hours_start, working_hours_end, working_hours } = req.body;

    console.log("Incoming data:", req.body);

    // Update user role to Barber
    const user = await User.findById(req.user.id);
    user.role = 'Barber';
    await user.save();

    const newBarberProfile = new BarberProfile({
      user_id: req.user.id,
      location,
      experience,
      services_offered,
      working_hours,
    });

    console.log("New Barber Profile:", newBarberProfile);

    await newBarberProfile.save();

    console.log("Barber profile created successfully");

    res.status(201).json({ message: "Barber profile created successfully", role: user.role });
  } catch (error) {
    console.error("Error creating barber profile:", error);
    res.status(500).json({ message: "Error creating barber profile", error });
  }
};
exports.listBarbers = async (req, res) => {
  try {
    const barbers = await BarberProfile.find().populate('user_id');
    res.status(200).json(barbers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching barbers', error });
  }
};
exports.updateBarberProfile = async (req, res) => {
  try {
    const barberProfile = await BarberProfile.findOneAndUpdate({ user_id: req.user.id }, req.body, { new: true });
    res.status(200).json({ message: "Barber profile updated successfully", barberProfile });
  } catch (error) {
    res.status(500).json({ message: "Error updating barber profile", error });
  }
};

exports.getBarberAvailability = async (req, res) => {
  try {
    const { barberId, date } = req.query;
    console.log("Fetching availability for:", barberId, date);

    const barberProfile = await BarberProfile.findById(barberId);
    if (!barberProfile) {
      return res.status(404).json({ message: "Barber not found" });
    }

    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const dayOff = barberProfile.working_hours.day_off;
    const workingHours = barberProfile.working_hours.hours;

    if (dayOfWeek === dayOff || workingHours === "Closed") {
      return res.status(200).json({ unavailableTimes: [], workingHours: "Closed" });
    }

    const appointments = await Appointment.find({
      barber_id: barberId,
      appointment_date: date,
      status: "Scheduled"
    });

    const unavailableTimes = appointments.map(app => app.appointment_time);

    res.status(200).json({ unavailableTimes, workingHours });
  } catch (error) {
    console.error('Error fetching barber availability:', error);
    res.status(500).json({ message: 'Error fetching barber availability', error });
  }
};
