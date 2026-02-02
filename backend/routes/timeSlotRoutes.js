import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createTimeSlot,
  getTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot
} from '../controllers/timeSlotController.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['doctor']), createTimeSlot);
router.get('/doctor/:doctorId', getTimeSlots);
router.get('/:id', getTimeSlotById);
router.put('/:id', authMiddleware, roleMiddleware(['doctor']), updateTimeSlot);
router.delete('/:id', authMiddleware, roleMiddleware(['doctor']), deleteTimeSlot);

// Admin-only routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getTimeSlots);
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateTimeSlot);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deleteTimeSlot);

export default router;
