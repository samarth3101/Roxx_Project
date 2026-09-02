import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  signup,
  login,
  getProfile,
  updatePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  signupSchema,
  loginSchema,
  updatePasswordSchema,
} from '../validators/authValidator.js';

const router = express.Router();

// Rate limiter for auth endpoints: 100 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many login/signup attempts from this IP, please try again after 15 minutes.',
    errors: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', authLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authenticate, getProfile);
router.put('/update-password', authenticate, validate(updatePasswordSchema), updatePassword);

export default router;
