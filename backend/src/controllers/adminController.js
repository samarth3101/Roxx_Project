import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const {
      search = '',
      name = '',
      email = '',
      address = '',
      role = '',
      sortField = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const where = {};

    // Filters
    if (role && ['ADMIN', 'USER', 'STORE_OWNER'].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    } else {
      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }
      if (email) {
        where.email = { contains: email, mode: 'insensitive' };
      }
      if (address) {
        where.address = { contains: address, mode: 'insensitive' };
      }
    }

    // Fetch users with their store and rating aggregations
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        store: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    // Map and compute store owner rating
    let formattedUsers = users.map((user) => {
      let storeRating = null;
      let totalStoreRatings = 0;

      if (user.role === 'STORE_OWNER' && user.store) {
        const ratings = user.store.ratings;
        totalStoreRatings = ratings.length;
        if (ratings.length > 0) {
          const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
          storeRating = parseFloat((sum / ratings.length).toFixed(2));
        } else {
          storeRating = 0;
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
        store: user.store ? { id: user.store.id, name: user.store.name } : null,
        storeRating,
        totalStoreRatings,
      };
    });

    // In-memory sorting to support computed fields like storeRating alongside DB fields
    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt', 'storeRating'];
    const actualSortField = validSortFields.includes(sortField) ? sortField : 'createdAt';
    const isAsc = sortOrder.toLowerCase() === 'asc';

    formattedUsers.sort((a, b) => {
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
        total: formattedUsers.length,
        users: formattedUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        store: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: [],
      });
    }

    let storeRating = null;
    if (user.role === 'STORE_OWNER' && user.store) {
      const ratings = user.store.ratings;
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        storeRating = parseFloat((sum / ratings.length).toFixed(2));
      } else {
        storeRating = 0;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          store: user.store
            ? {
                id: user.store.id,
                name: user.store.name,
                email: user.store.email,
                address: user.store.address,
              }
            : null,
          storeRating,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
        errors: [{ field: 'email', message: 'Email already registered' }],
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const getStores = async (req, res, next) => {
  try {
    const {
      search = '',
      name = '',
      email = '',
      address = '',
      sortField = 'name',
      sortOrder = 'asc',
    } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    } else {
      if (name) {
        where.name = { contains: name, mode: 'insensitive' };
      }
      if (email) {
        where.email = { contains: email, mode: 'insensitive' };
      }
      if (address) {
        where.address = { contains: address, mode: 'insensitive' };
      }
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    let formattedStores = stores.map((store) => {
      const ratings = store.ratings || [];
      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0
          ? parseFloat((ratings.reduce((acc, r) => acc + r.rating, 0) / totalRatings).toFixed(2))
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        owner: store.owner,
        rating: averageRating,
        totalRatings,
        createdAt: store.createdAt,
      };
    });

    const validSortFields = ['name', 'email', 'address', 'rating', 'totalRatings', 'createdAt'];
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

export const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Check store email uniqueness
    const existingStore = await prisma.store.findUnique({
      where: { email },
    });

    if (existingStore) {
      return res.status(409).json({
        success: false,
        message: 'A store with this email already exists.',
        errors: [{ field: 'email', message: 'Store email already registered' }],
      });
    }

    // Verify owner exists and has role STORE_OWNER
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
      include: { store: true },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Specified store owner user was not found.',
        errors: [{ field: 'ownerId', message: 'Owner user not found' }],
      });
    }

    if (owner.role !== 'STORE_OWNER') {
      return res.status(400).json({
        success: false,
        message: 'The selected user does not have the STORE_OWNER role.',
        errors: [{ field: 'ownerId', message: 'User must be a STORE_OWNER' }],
      });
    }

    if (owner.store) {
      return res.status(409).json({
        success: false,
        message: 'This user already owns a registered store. Each store owner can manage one store.',
        errors: [{ field: 'ownerId', message: 'Owner already assigned to a store' }],
      });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: { store },
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableStoreOwners = async (req, res, next) => {
  try {
    const owners = await prisma.user.findMany({
      where: {
        role: 'STORE_OWNER',
        store: null, // Only store owners who don't yet have a store assigned
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: { owners },
    });
  } catch (error) {
    next(error);
  }
};
