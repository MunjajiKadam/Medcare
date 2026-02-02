import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription
} from '../controllers/prescriptionController.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['doctor']), createPrescription);
router.get('/', authMiddleware, getPrescriptions);
router.get('/:id', authMiddleware, getPrescriptionById);
router.put('/:id', authMiddleware, updatePrescription);
router.delete('/:id', authMiddleware, deletePrescription);

// Admin-only routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getPrescriptions);
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updatePrescription);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deletePrescription);

export default router;
