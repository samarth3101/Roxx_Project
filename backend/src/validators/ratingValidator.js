import { z } from 'zod';

export const submitRatingSchema = z.object({
  storeId: z
    .string({ required_error: 'Store ID is required' })
    .uuid('Invalid store ID format'),
  rating: z
    .number({ required_error: 'Rating is required' })
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
});
