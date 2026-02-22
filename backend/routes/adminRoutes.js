import express from 'express';
import { getSettings, updateSettings } from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
