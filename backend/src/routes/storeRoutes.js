import express from 'express';
import { getAllStoresForUser } from '../controllers/storeController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getAllStoresForUser);

export default router;
