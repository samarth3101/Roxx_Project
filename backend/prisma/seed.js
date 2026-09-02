import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing tables in reverse dependency order
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records');

  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const ownerPassword = await bcrypt.hash('Owner@1234', 10);
  const userPassword = await bcrypt.hash('User@1234', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator User Account', // 34 chars (valid 20-60)
      email: 'admin@roxx.com',
      password: adminPassword,
      address: '100 Corporate Plaza, Silicon Boulevard, Suite 500, Tech Metropolis',
      role: 'ADMIN',
    },
  });

  // 2. Create Store Owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'Alexander James Store Owner 1', // 29 chars
      email: 'owner1@roxx.com',
      password: ownerPassword,
      address: '450 Commercial Avenue, Market District, New York, NY 10001',
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Beatrice Evelyn Store Owner 2', // 29 chars
      email: 'owner2@roxx.com',
      password: ownerPassword,
      address: '782 Waterfront Way, Marina Boulevard, San Francisco, CA 94105',
      role: 'STORE_OWNER',
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      name: 'Christopher David Store Owner 3', // 31 chars
      email: 'owner3@roxx.com',
      password: ownerPassword,
      address: '310 Pine Street, Downtown Quarter, Seattle, WA 98101',
      role: 'STORE_OWNER',
    },
  });

  // 3. Create Normal Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Christopher Robin Customer One', // 30 chars
      email: 'user1@roxx.com',
      password: userPassword,
      address: '12 Blossom Lane, Green Meadows Suburb, Austin, TX 78701',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Deborah Samantha Customer Two', // 29 chars
      email: 'user2@roxx.com',
      password: userPassword,
      address: '89 Willow Creek Road, Timberland Park, Denver, CO 80202',
      role: 'USER',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Elijah Benjamin Customer Three', // 30 chars
      email: 'user3@roxx.com',
      password: userPassword,
      address: '556 Magnolia Avenue, Riverfront Terrace, Chicago, IL 60601',
      role: 'USER',
    },
  });

  console.log('👤 Created Users (1 Admin, 3 Store Owners, 3 Normal Users)');

  // 4. Create Stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Apex Grand Artisan Emporium', // 27 chars
      email: 'store1@roxx.com',
      address: '742 Evergreen Terrace, Commercial Core, Springfield',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Beacon Peak Gourmet Specialty', // 29 chars
      email: 'store2@roxx.com',
      address: '1200 Sunset Strip, Harbor View Plaza, Los Angeles',
      ownerId: owner2.id,
    },
  });

  console.log('🏪 Created 2 Stores assigned to Store Owners');

  // 5. Create Ratings
  await prisma.rating.createMany({
    data: [
      { userId: user1.id, storeId: store1.id, rating: 5 },
      { userId: user2.id, storeId: store1.id, rating: 4 },
      { userId: user3.id, storeId: store1.id, rating: 5 },
      { userId: user1.id, storeId: store2.id, rating: 3 },
      { userId: user2.id, storeId: store2.id, rating: 4 },
    ],
  });

  console.log('⭐ Created 5 Initial Ratings across stores');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
