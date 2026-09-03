import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z
    .string({ required_error: 'Store name is required' })
    .trim()
    .min(2, 'Store name must be at least 2 characters long')
    .max(60, 'Store name cannot exceed 60 characters'),
  email: z
    .string({ required_error: 'Store email is required' })
    .trim()
    .email('Please enter a valid email address')
    .toLowerCase(),
  address: z
    .string({ required_error: 'Store address is required' })
    .trim()
    .min(1, 'Store address cannot be empty')
    .max(400, 'Store address cannot exceed 400 characters'),
  ownerId: z
    .string({ required_error: 'Store owner ID is required' })
    .uuid('Invalid owner ID format'),
});
