import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createTimeSlot,
  getTimeSlots,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot
} from '../controllers/timeSlotController.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['doctor']), createTimeSlot);

// Get time slots - supports both /doctor/:doctorId and ?doctor_id=id
router.get('/', getTimeSlots);
router.get('/doctor/:doctorId', getTimeSlots);

// Get by ID
router.get('/:id', getTimeSlotById);

// Update and delete
router.put('/:id', authMiddleware, roleMiddleware(['doctor']), updateTimeSlot);
router.delete('/:id', authMiddleware, roleMiddleware(['doctor']), deleteTimeSlot);

// Admin-only routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getAllTimeSlots);
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateTimeSlot);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deleteTimeSlot);

export default router;
