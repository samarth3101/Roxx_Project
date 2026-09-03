import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

export const signupSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(5, 'Name must be at least 5 characters long')
    .max(60, 'Name cannot exceed 60 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  address: z
    .string({ required_error: 'Address is required' })
    .trim()
    .min(1, 'Address cannot be empty')
    .max(400, 'Address cannot exceed 400 characters'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password cannot exceed 16 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter and at least one special character'
    ),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const updatePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: 'Current password is required' })
    .min(1, 'Current password is required'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password cannot exceed 16 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter and at least one special character'
    ),
});

export const createUserByAdminSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(5, 'Name must be at least 5 characters long')
    .max(60, 'Name cannot exceed 60 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  address: z
    .string({ required_error: 'Address is required' })
    .trim()
    .min(1, 'Address cannot be empty')
    .max(400, 'Address cannot exceed 400 characters'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .max(16, 'Password cannot exceed 16 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter and at least one special character'
    ),
  role: z.enum(['ADMIN', 'USER', 'STORE_OWNER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, USER, or STORE_OWNER' }),
  }),
});
