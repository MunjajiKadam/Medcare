import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorsBySpecialization,
  getDoctorReviews
} from '../controllers/doctorController.js';

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/specialty/:specialization', getDoctorsBySpecialization);
router.get('/:id', getDoctorById);
router.get('/:id/reviews', getDoctorReviews);

// Protected routes
router.get('/profile/:id', authMiddleware, getDoctorProfile);
router.put('/profile/:id', authMiddleware, updateDoctorProfile);

// Admin-only routes - UPDATE doctor
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateDoctorProfile);

export default router;
