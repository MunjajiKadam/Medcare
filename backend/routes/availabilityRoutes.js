import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getDoctorAvailability,
  updateAvailabilityStatus,
  upsertTimeSlot,
  toggleTimeSlotAvailability,
  deleteTimeSlot,
  getAvailabilityHistory
} from '../controllers/availabilityController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware);

// Get doctor availability
router.get('/doctor/:doctorId', getDoctorAvailability);

// Update availability status
router.put('/status', updateAvailabilityStatus);

// Get availability history
router.get('/history', getAvailabilityHistory);

// Upsert time slot
router.post('/time-slot', upsertTimeSlot);

// Toggle time slot availability
router.put('/time-slot/:slotId/toggle', toggleTimeSlotAvailability);

// Delete time slot
router.delete('/time-slot/:slotId', deleteTimeSlot);

export default router;
