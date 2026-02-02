import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllPatients,
  getPatientById,
  getPatientProfile,
  updatePatientProfile,
  deletePatient
} from '../controllers/patientController.js';

const router = express.Router();

// Admin routes - GET all patients
router.get('/', authMiddleware, roleMiddleware(['admin']), getAllPatients);

// Admin routes - UPDATE patient
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updatePatientProfile);

// Admin routes - DELETE patient
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deletePatient);

// Protected routes
router.get('/profile', authMiddleware, getPatientProfile);
router.put('/profile', authMiddleware, updatePatientProfile);
router.get('/:id', authMiddleware, getPatientById);

export default router;
