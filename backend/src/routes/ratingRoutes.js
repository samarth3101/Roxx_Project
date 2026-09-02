import express from 'express';
import { upsertRating } from '../controllers/ratingController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { validate } from '../middleware/validate.js';
import { submitRatingSchema } from '../validators/ratingValidator.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  requireRole(['USER']),
  validate(submitRatingSchema),
  upsertRating
);

export default router;
