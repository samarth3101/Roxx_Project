import app from './app.js';
import prisma from './config/db.js';
import http from 'http';

async function runApiTests() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5099, resolve));
  const baseUrl = 'http://localhost:5099/api';

  console.log('🧪 Running Backend API Verification Tests on', baseUrl);

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`, err.message);
      failed++;
    }
  };

  try {
    // 1. Health check
    await test('Health check returns ok', async () => {
      const res = await fetch(`${baseUrl}/health`);
      const data = await res.json();
      if (data.status !== 'ok') throw new Error('Health check status is not ok');
    });

    // 2. Admin Login
    let adminToken = '';
    await test('Admin login with valid credentials', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@roxx.com',
          password: 'Admin@1234',
        }),
      });
      const data = await res.json();
      if (!data.success || !data.data.token || data.data.user.role !== 'ADMIN') {
        throw new Error('Admin login failed: ' + JSON.stringify(data));
      }
      adminToken = data.data.token;
    });

    // 3. User Login
    let userToken = '';
    let userId = '';
    await test('Normal user login with valid credentials', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user1@roxx.com',
          password: 'User@1234',
        }),
      });
      const data = await res.json();
      if (!data.success || !data.data.token || data.data.user.role !== 'USER') {
        throw new Error('User login failed: ' + JSON.stringify(data));
      }
      userToken = data.data.token;
      userId = data.data.user.id;
    });

    // 4. Store Owner Login
    let ownerToken = '';
    await test('Store Owner login with valid credentials', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'owner1@roxx.com',
          password: 'Owner@1234',
        }),
      });
      const data = await res.json();
      if (!data.success || !data.data.token || data.data.user.role !== 'STORE_OWNER') {
        throw new Error('Owner login failed: ' + JSON.stringify(data));
      }
      ownerToken = data.data.token;
    });

    // 5. Validation Rejection on Signup
    await test('Signup rejects name < 2 characters', async () => {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'S',
          email: 'newuser@example.com',
          password: 'Password@123',
          address: 'Some address somewhere',
        }),
      });
      const data = await res.json();
      if (res.status !== 400 || data.success !== false) {
        throw new Error('Expected 400 validation error for short name');
      }
    });

    await test('Signup rejects password missing special char', async () => {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Valid Long Name For Account User',
          email: 'newuser@example.com',
          password: 'Password1234', // No special char
          address: 'Some address somewhere',
        }),
      });
      const data = await res.json();
      if (res.status !== 400 || data.success !== false) {
        throw new Error('Expected 400 validation error for weak password');
      }
    });

    // 6. Admin Dashboard Stats
    await test('Admin dashboard returns counts', async () => {
      const res = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!data.success || typeof data.data.totalUsers !== 'number' || typeof data.data.totalStores !== 'number') {
        throw new Error('Invalid dashboard stats: ' + JSON.stringify(data));
      }
    });

    // 7. Admin User List with Store Owner Rating
    await test('Admin user list returns users and includes store rating for store owner', async () => {
      const res = await fetch(`${baseUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data.users)) {
        throw new Error('Failed to get admin users');
      }
      const ownerUser = data.data.users.find((u) => u.email === 'owner1@roxx.com');
      if (!ownerUser || typeof ownerUser.storeRating !== 'number') {
        throw new Error('Owner store rating not calculated: ' + JSON.stringify(ownerUser));
      }
    });

    // 8. Normal User Store List with Ratings
    let storeIdToRate = '';
    await test('User store list includes overall rating and user rating', async () => {
      const res = await fetch(`${baseUrl}/stores`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (!data.success || data.data.stores.length === 0) {
        throw new Error('Failed to get stores for user');
      }
      const store1 = data.data.stores.find((s) => s.email === 'store1@roxx.com');
      if (!store1 || store1.overallRating <= 0 || store1.userRating !== 5) {
        throw new Error('Store 1 ratings mismatch: ' + JSON.stringify(store1));
      }
      storeIdToRate = store1.id;
    });

    // 9. Modify (Upsert) Rating
    await test('User can modify rating (upsert)', async () => {
      const res = await fetch(`${baseUrl}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          storeId: storeIdToRate,
          rating: 4, // modify from 5 to 4
        }),
      });
      const data = await res.json();
      if (!data.success || data.data.rating.rating !== 4) {
        throw new Error('Rating upsert failed: ' + JSON.stringify(data));
      }
    });

    // 10. Store Owner Dashboard
    await test('Store owner dashboard displays reviews & average rating', async () => {
      const res = await fetch(`${baseUrl}/store-owner/dashboard`, {
        headers: { Authorization: `Bearer ${ownerToken}` },
      });
      const data = await res.json();
      if (!data.success || !data.data.hasStore || data.data.ratings.length === 0) {
        throw new Error('Store owner dashboard failed: ' + JSON.stringify(data));
      }
    });

    // 11. Role Guard Enforcement
    await test('Normal user cannot access admin routes (403 Forbidden)', async () => {
      const res = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (res.status !== 403) {
        throw new Error('Expected 403 Forbidden, got ' + res.status);
      }
    });

    console.log(`\n🎉 All Backend Tests Completed: ${passed} passed, ${failed} failed`);
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runApiTests();
