import express from 'express';
import { register, login, logout, changePassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.post('/change-password', authMiddleware, changePassword);

export default router;
