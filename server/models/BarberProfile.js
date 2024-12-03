const mongoose = require("mongoose");

const BarberProfileSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: String, required: true },
    experience: { type: Number, required: true },
    services_offered: [{ type: String, required: true }],
    working_hours: {
      day_off: { type: String, required: true }, // Day off (e.g., "Sunday")
      hours: { type: String, required: true }    // Working hours (e.g., "09:00-17:00")
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarberProfile", BarberProfileSchema);
