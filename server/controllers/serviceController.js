const Service = require("../models/Service");
const BarberProfile = require("../models/BarberProfile");

exports.getServices = async (req, res) => {
  try {
    const barberId = req.params.barberId;
    const services = await Service.find({ barber_id: barberId });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addService = async (req, res) => {
  try {
    const barberProfile = await BarberProfile.findOne({ user_id: req.user._id });
    if (!barberProfile || req.user.role !== "Barber") {
      return res.status(403).json({ message: "Unauthorized: Only barbers can add services" });
    }

    const newService = new Service({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      barber_id: barberProfile._id,
    });

    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const barberProfile = await BarberProfile.findOne({ user_id: req.user._id });
    if (!barberProfile || req.user.role !== "Barber" || service.barber_id.toString() !== barberProfile._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Only the barber who owns the service can delete it" });
    }

    await service.remove();
    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
