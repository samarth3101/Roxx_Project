import prisma from '../config/db.js';

export const getOwnerDashboard = async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const { sortField = 'createdAt', sortOrder = 'desc' } = req.query;

    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      return res.status(200).json({
        success: true,
        data: {
          hasStore: false,
          message: 'No store is currently assigned to this account. Please contact an administrator.',
          store: null,
          averageRating: 0,
          totalRatings: 0,
          ratings: [],
        },
      });
    }

    const ratingsList = store.ratings || [];
    const totalRatings = ratingsList.length;
    const averageRating =
      totalRatings > 0
        ? parseFloat((ratingsList.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(2))
        : 0;

    let formattedRatings = ratingsList.map((r) => ({
      id: r.id,
      rating: r.rating,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: {
        id: r.user.id,
        name: r.user.name,
        email: r.user.email,
        address: r.user.address,
      },
    }));

    // Sorting
    const isAsc = sortOrder.toLowerCase() === 'asc';
    formattedRatings.sort((a, b) => {
      let valA, valB;
      if (sortField === 'name') {
        valA = a.user.name;
        valB = b.user.name;
      } else if (sortField === 'email') {
        valA = a.user.email;
        valB = b.user.email;
      } else if (sortField === 'rating') {
        valA = a.rating;
        valB = b.rating;
      } else {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

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
        hasStore: true,
        store: {
          id: store.id,
          name: store.name,
          email: store.email,
          address: store.address,
          createdAt: store.createdAt,
        },
        averageRating,
        totalRatings,
        ratings: formattedRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};
