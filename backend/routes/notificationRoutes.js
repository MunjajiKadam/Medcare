import express from 'express';
import { 
  getUserNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  sendNotificationToPatient,
  getDoctorPatients
} from '../controllers/notificationController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.get('/', authMiddleware, getUserNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.put('/:id/read', authMiddleware, markAsRead);
router.put('/mark-all-read', authMiddleware, markAllAsRead);
router.delete('/:id', authMiddleware, deleteNotification);

// Doctor-only routes
router.post('/send-to-patient', authMiddleware, roleMiddleware(['doctor']), sendNotificationToPatient);
router.get('/doctor/patients', authMiddleware, roleMiddleware(['doctor']), getDoctorPatients);

export default router;
