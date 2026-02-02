import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createReview,
  getReviews,
  getReviewsByDoctor,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/doctor/:doctorId', getReviewsByDoctor);

// Protected routes
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

// Admin-only routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getReviews);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deleteReview);

export default router;
