import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { executeQuery } from './config/database.js';
import logger from './utils/logger.js';
import errorMiddleware from './middleware/errorMiddleware.js';

// Load environment variables early
dotenv.config();

// Routes
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import healthRecordRoutes from './routes/healthRecordRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import timeSlotRoutes from './routes/timeSlotRoutes.js';
import consultationNotesRoutes from './routes/consultationNotesRoutes.js';
import diagnosisRoutes from './routes/diagnosisRoutes.js';
import availabilityRoutes from './routes/availabilityRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import proxyRoutes from './routes/proxyRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Respond to Private Network preflight requests
app.use((req, res, next) => {
  try {
    if (req.headers['access-control-request-private-network']) {
      res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
  } catch (e) {
    // ignore
  }
  next();
});


// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    await executeQuery('SELECT 1');
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

// Routes Implementation
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/consultation-notes', consultationNotesRoutes);
app.use('/api/diagnoses', diagnosisRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/proxy', proxyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'MedCare Backend API v1.0' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  logger.info(`✓ MedCare Backend Server running on http://localhost:${PORT}`);
  logger.info(`✓ Health Check: http://localhost:${PORT}/api/health`);
});
