const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    barber_id: { type: mongoose.Schema.Types.ObjectId, ref: "BarberProfile", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
