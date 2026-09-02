export const errorHandler = (err, req, res, next) => {
  console.error('Error encountered:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Zod Validation Error
  if (err.name === 'ZodError') {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  }

  // Prisma Unique Constraint Error (e.g. unique email or unique rating)
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${fields} already exists.`,
      errors: [{ field: fields, message: `Duplicate value for ${fields}` }],
    });
  }

  // Prisma Foreign Key or Not Found Error
  if (err.code === 'P2025' || err.code === 'P2003') {
    return res.status(404).json({
      success: false,
      message: err.meta?.cause || 'Referenced record not found.',
      errors: [],
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.',
      errors: [],
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token has expired. Please log in again.',
      errors: [],
    });
  }

  // Custom Application Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
};
