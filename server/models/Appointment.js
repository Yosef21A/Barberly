const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    barber_id: { type: mongoose.Schema.Types.ObjectId, ref: "BarberProfile", required: true },
    appointment_date: { type: Date, required: true },
    appointment_time: { type: String, required: true },
    status: { type: String, enum: ["Scheduled", "Canceled", "Completed"], default: "Scheduled" },
    approval_status: { type: String, enum: ["Pending", "Approved", "Declined"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);
