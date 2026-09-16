const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const demandRoutes = require('./routes/demandRoutes');
const skillRoutes = require('./routes/skillRoutes');
const courseRoutes = require('./routes/courseRoutes');
const curriculumRoutes = require('./routes/curriculumRoutes');
const districtRoutes = require('./routes/districtRoutes');
const employerRoutes = require('./routes/employerRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/demand', demandRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', employerRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsync', {
      serverSelectionTimeoutMS: 2000
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB connection unavailable, running backend with in-memory prototype persistence layer.');
    console.warn('MongoDB connection error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
  }
};

connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'SkillBridge AI API is running'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
