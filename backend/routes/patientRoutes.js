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

// Protected routes - GET own profile
router.get('/profile', authMiddleware, getPatientProfile);

// Protected routes - UPDATE own profile (health info)
router.put('/profile', authMiddleware, updatePatientProfile);

// Protected routes - UPDATE personal info (name, email, phone)
router.put('/personal-info', authMiddleware, updatePersonalInfo);

// Get patient by ID (admin or self)
router.get('/:id', authMiddleware, getPatientById);

// Admin routes - UPDATE patient
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updatePatientProfile);

// Admin routes - DELETE patient
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deletePatient);

export default router;
