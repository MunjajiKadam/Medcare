import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllPatients,
  getPatientById,
  getPatientProfile,
  updatePatientProfile,
  updatePersonalInfo,
  deletePatient
} from '../controllers/patientController.js';

const router = express.Router();

// Admin routes - GET all patients
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllPatients);

// Protected routes - GET own profile (must be before /:id route)
router.get('/profile', authMiddleware, getPatientProfile);

// Protected routes - UPDATE own profile (health info) (must be before /:id route)
router.put('/profile', authMiddleware, updatePatientProfile);

// Protected routes - UPDATE personal info (name, email, phone) (must be before /:id route)
router.put('/personal-info', authMiddleware, updatePersonalInfo);

// Get patient by ID (admin or self) - this must be AFTER all specific routes
router.get('/:id', authMiddleware, getPatientById);

// Admin routes - UPDATE patient
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updatePatientProfile);

// Admin routes - DELETE patient
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deletePatient);

export default router;
