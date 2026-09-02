import express from 'express';
import { getOwnerDashboard } from '../controllers/storeOwnerController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const router = express.Router();

router.use(authenticate, requireRole(['STORE_OWNER']));

router.get('/dashboard', getOwnerDashboard);

export default router;
