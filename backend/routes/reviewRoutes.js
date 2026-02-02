import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createReview,
  getReviews,
  getReviewsByDoctor,
  deleteReview
} from '../controllers/reviewController.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, createReview);
router.get('/', getReviews);
router.get('/doctor/:doctorId', getReviewsByDoctor);
router.delete('/:id', authMiddleware, deleteReview);

// Admin-only routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getReviews);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deleteReview);

export default router;
