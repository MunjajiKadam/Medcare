import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createDiagnosis,
  getDiagnosisByAppointment,
  getPatientDiagnoses,
  updateDiagnosis,
  deleteDiagnosis
} from '../controllers/diagnosisController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware);

// Create diagnosis
router.post('/', createDiagnosis);

// Get diagnoses by appointment
router.get('/appointment/:appointmentId', getDiagnosisByAppointment);

// Get patient diagnoses
router.get('/', getPatientDiagnoses);

// Update diagnosis
router.put('/:diagnosisId', updateDiagnosis);

// Delete diagnosis
router.delete('/:diagnosisId', deleteDiagnosis);

export default router;
