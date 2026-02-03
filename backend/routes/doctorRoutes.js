import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorsBySpecialization,
  getDoctorReviews,
  getCurrentDoctorProfile
} from '../controllers/doctorController.js';

const router = express.Router();

// Public routes - more specific routes first
router.get('/specialty/:specialization', getDoctorsBySpecialization);
router.get('/', getAllDoctors);
router.get('/:id/reviews', getDoctorReviews);
router.get('/:id', getDoctorById);

// Protected routes
router.get('/profile/me', authMiddleware, roleMiddleware(['doctor']), getCurrentDoctorProfile);
router.get('/profile/:id', authMiddleware, getDoctorProfile);
router.put('/profile/:id', authMiddleware, updateDoctorProfile);

// Admin-only routes - UPDATE doctor
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateDoctorProfile);

export default router;
