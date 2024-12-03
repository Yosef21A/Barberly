const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();  // Load .env file

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());  // Body parser
app.use(cors());  // CORS middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.log('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);  // Auth routes

app.listen(port, () => console.log(`Server running on port ${port}`));
