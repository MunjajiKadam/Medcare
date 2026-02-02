import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { executeQuery } from './config/database.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import healthRecordRoutes from './routes/healthRecordRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import timeSlotRoutes from './routes/timeSlotRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await executeQuery('SELECT 1');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      message: 'Backend is running successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      message: error.message 
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/time-slots', timeSlotRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'MedCare Backend API v1.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ MedCare Backend Server running on http://localhost:${PORT}`);
  console.log(`✓ API Documentation: http://localhost:${PORT}/api`);
  console.log(`✓ Health Check: http://localhost:${PORT}/api/health`);
});
