import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  createConsultationNotes,
  getConsultationNotes,
  getDoctorConsultationNotes,
  updateConsultationNotes
} from '../controllers/consultationNotesController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware);

// Create consultation notes
router.post('/', createConsultationNotes);

// Get consultation notes by appointment
router.get('/appointment/:appointmentId', getConsultationNotes);

// Get all consultation notes for doctor
router.get('/', getDoctorConsultationNotes);

// Update consultation notes
router.put('/:notesId', updateConsultationNotes);

export default router;
