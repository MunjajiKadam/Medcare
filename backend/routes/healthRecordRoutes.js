import express from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';
import {
  createHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  updateHealthRecord,
  deleteHealthRecord
} from '../controllers/healthRecordController.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['patient']), createHealthRecord);
router.get('/', authMiddleware, roleMiddleware(['patient']), getHealthRecords);
router.get('/:id', authMiddleware, getHealthRecordById);
router.put('/:id', authMiddleware, updateHealthRecord);
router.delete('/:id', authMiddleware, deleteHealthRecord);

// Admin-only routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getHealthRecords);
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), updateHealthRecord);
router.delete('/admin/:id', authMiddleware, roleMiddleware(['admin']), deleteHealthRecord);

export default router;
