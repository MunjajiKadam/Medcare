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

// Admin-only routes - MUST come before dynamic routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getAllTimeSlots);
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateTimeSlot);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deleteTimeSlot);

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['doctor']), createTimeSlot);
router.get('/', authMiddleware, getTimeSlots);  // Protected - gets own slots if doctor

// Get time slots - supports both /doctor/:doctorId and ?doctor_id=id
router.get('/doctor/:doctorId', getTimeSlots);

// Update and delete
router.put('/:id', authMiddleware, roleMiddleware(['doctor']), updateTimeSlot);
router.delete('/:id', authMiddleware, roleMiddleware(['doctor']), deleteTimeSlot);

// Get by ID - MUST be last
router.get('/:id', getTimeSlotById);

export default router;
