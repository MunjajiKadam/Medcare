import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment
} from '../controllers/appointmentController.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, createAppointment);
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getAppointments);
router.get('/', authMiddleware, getAppointments);
router.get('/:id', authMiddleware, getAppointmentById);
router.put('/:id', authMiddleware, updateAppointment);
router.delete('/:id', authMiddleware, cancelAppointment);

// Admin-only routes
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateAppointment);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), cancelAppointment);

export default router;
