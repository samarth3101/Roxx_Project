import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getUserById,
  createUser,
  getStores,
  createStore,
  getAvailableStoreOwners,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { createUserByAdminSchema } from '../validators/authValidator.js';
import { createStoreSchema } from '../validators/storeValidator.js';

const router = express.Router();

// Admin-only protection for all subroutes
router.use(authenticate, requireRole(['ADMIN']));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', validate(createUserByAdminSchema), createUser);
router.get('/stores', getStores);
router.post('/stores', validate(createStoreSchema), createStore);
router.get('/store-owners-available', getAvailableStoreOwners);

export default router;
