import prisma from '../config/db.js';

export const upsertRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check that store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.',
        errors: [{ field: 'storeId', message: 'Store does not exist' }],
      });
    }

    // Check if store owner is trying to rate their own store
    if (store.ownerId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Store owners cannot submit ratings for their own store.',
        errors: [],
      });
    }

    // Upsert rating (create if not exists, update if exists)
    const ratingRecord = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        rating,
      },
      create: {
        userId,
        storeId,
        rating,
      },
    });

    // Compute new overall rating for this store
    const storeRatings = await prisma.rating.findMany({
      where: { storeId },
      select: { rating: true },
    });

    const totalRatings = storeRatings.length;
    const overallRating =
      totalRatings > 0
        ? parseFloat((storeRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(2))
        : 0;

    return res.status(200).json({
      success: true,
      message: 'Rating submitted successfully.',
      data: {
        rating: ratingRecord,
        overallRating,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};
