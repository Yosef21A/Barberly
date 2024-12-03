const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // Connect MongoDB
dotenv.config(); // Load environment variables
const cors = require('cors');  // Import CORS

const app = express();
const port = process.env.PORT || 8000;

// Connect to MongoDB using the environment variables
const mongoURI = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster.aqqb8bl.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Database connected"))
    .catch(err => console.error("Database connection error:", err));

// Middleware
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Change the app.use(cors()) to the one below
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


// Import Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const barberRoutes = require("./routes/barberRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/barbers", barberRoutes);
app.use("/api/services", serviceRoutes);

// 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Start Server
app.listen(port, () => console.log(`Server is running on port: ${port}`));
