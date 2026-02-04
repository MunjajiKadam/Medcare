import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorsBySpecialization,
  getDoctorReviews,
  getCurrentDoctorProfile,
  updateDoctorSettings,
  deleteDoctor
} from '../controllers/doctorController.js';

const router = express.Router();

// Protected routes - MUST come before dynamic routes
router.get('/profile/me', authMiddleware, roleMiddleware(['doctor']), getCurrentDoctorProfile);
router.get('/profile/:id', authMiddleware, getDoctorProfile);
router.put('/profile/:id', authMiddleware, updateDoctorProfile);

// Protected routes - UPDATE settings (theme, notifications)
router.put('/settings', authMiddleware, roleMiddleware(['doctor']), updateDoctorSettings);

// Public routes - more specific routes first
router.get('/specialty/:specialization', getDoctorsBySpecialization);
router.get('/:id/reviews', getDoctorReviews);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Admin-only routes - UPDATE doctor
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateDoctorProfile);

// Admin-only routes - DELETE doctor
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deleteDoctor);

export default router;
