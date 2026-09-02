import prisma from '../config/db.js';

export const getAllStoresForUser = async (req, res, next) => {
  try {
    const { search = '', sortField = 'name', sortOrder = 'asc' } = req.query;
    const currentUserId = req.user?.id;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: {
          select: {
            id: true,
            userId: true,
            rating: true,
            updatedAt: true,
          },
        },
      },
    });

    let formattedStores = stores.map((store) => {
      const allRatings = store.ratings || [];
      const totalRatings = allRatings.length;
      const overallRating =
        totalRatings > 0
          ? parseFloat((allRatings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(2))
          : 0;

      // Find current user's rating for this store
      const userRatingRecord = currentUserId
        ? allRatings.find((r) => r.userId === currentUserId)
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating,
        totalRatings,
        userRating: userRatingRecord ? userRatingRecord.rating : null,
        userRatingId: userRatingRecord ? userRatingRecord.id : null,
        userRatedAt: userRatingRecord ? userRatingRecord.updatedAt : null,
      };
    });

    const validSortFields = ['name', 'address', 'overallRating', 'userRating', 'totalRatings'];
    const actualSortField = validSortFields.includes(sortField) ? sortField : 'name';
    const isAsc = sortOrder.toLowerCase() === 'asc';

    formattedStores.sort((a, b) => {
      let valA = a[actualSortField];
      let valB = b[actualSortField];

      if (valA === null || valA === undefined) valA = isAsc ? Infinity : -Infinity;
      if (valB === null || valB === undefined) valB = isAsc ? Infinity : -Infinity;

      if (typeof valA === 'string') {
        return isAsc
          ? valA.localeCompare(valB, undefined, { sensitivity: 'base' })
          : valB.localeCompare(valA, undefined, { sensitivity: 'base' });
      }

      if (valA < valB) return isAsc ? -1 : 1;
      if (valA > valB) return isAsc ? 1 : -1;
      return 0;
    });

    return res.status(200).json({
      success: true,
      data: {
        total: formattedStores.length,
        stores: formattedStores,
      },
    });
  } catch (error) {
    next(error);
  }
};
