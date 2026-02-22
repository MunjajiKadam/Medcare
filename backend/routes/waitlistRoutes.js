import express from 'express';
import { joinWaitlist, getWaitlistStatus } from '../controllers/waitlistController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/join', authMiddleware, roleMiddleware(['patient']), joinWaitlist);
router.get('/status', authMiddleware, roleMiddleware(['patient']), getWaitlistStatus);

export default router;
