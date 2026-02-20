import express from 'express';
import proxyController from '../controllers/proxyController.js';

const router = express.Router();

router.get('/', proxyController.proxy);

export default router;
