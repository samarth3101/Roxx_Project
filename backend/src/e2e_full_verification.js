import app from './app.js';
import prisma from './config/db.js';
import http from 'http';

async function runE2EVerification() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(5088, resolve));
  const baseUrl = 'http://localhost:5088/api';

  console.log('🚀 Running Comprehensive E2E Verification Suite on', baseUrl);

  let passed = 0;
  let failed = 0;

  const assertTest = async (title, fn) => {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${title}:`, err.message);
      failed++;
    }
  };

  try {
    // ----------------------------------------------------
    // 1. ADMIN JOURNEY
    // ----------------------------------------------------
    console.log('\n--- 1. SYSTEM ADMINISTRATOR JOURNEY ---');
    let adminToken = '';
    await assertTest('Admin logs in with valid credentials', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@roxx.com', password: 'Admin@1234' }),
      });
      const data = await res.json();
      if (!data.success || data.data.user.role !== 'ADMIN') throw new Error('Failed to login as admin');
      adminToken = data.data.token;
    });

    await assertTest('Admin views dashboard counts (totalUsers, totalStores, totalRatings)', async () => {
      const res = await fetch(`${baseUrl}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!data.success || data.data.totalUsers < 1 || data.data.totalStores < 1) {
        throw new Error('Invalid dashboard counts: ' + JSON.stringify(data));
      }
    });

    let newOwnerId = '';
    const ownerEmail = `artisan.owner.${Date.now()}@roxx.com`;
    await assertTest('Admin creates a new Store Owner user (valid 20-60 name)', async () => {
      const res = await fetch(`${baseUrl}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: 'Benjamin Franklin Senior Artisan', // 33 chars (valid 20-60)
          email: ownerEmail,
          password: 'OwnerPass@2026',
          address: '99 Constitution Way, Independence Mall, Philadelphia, PA 19106',
          role: 'STORE_OWNER',
        }),
      });
      const data = await res.json();
      if (!data.success || !data.data.user.id) throw new Error('Create user failed: ' + JSON.stringify(data));
      newOwnerId = data.data.user.id;
    });

    let newStoreId = '';
    const storeEmail = `liberty.crafts.${Date.now()}@roxx.com`;
    await assertTest('Admin registers a new Store assigned to the new Store Owner', async () => {
      const res = await fetch(`${baseUrl}/admin/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: 'Liberty Heritage Handcrafted Goods', // 34 chars (valid 20-60)
          email: storeEmail,
          address: '1776 Freedom Boulevard, Historic Quarter, Philadelphia, PA',
          ownerId: newOwnerId,
        }),
      });
      const data = await res.json();
      if (!data.success || !data.data.store.id) throw new Error('Create store failed: ' + JSON.stringify(data));
      newStoreId = data.data.store.id;
    });

    await assertTest('Admin lists users with filtering & sorting, verifying store owner rating is included', async () => {
      const res = await fetch(`${baseUrl}/admin/users?role=STORE_OWNER&sortField=name&sortOrder=asc`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!data.success || !Array.isArray(data.data.users)) throw new Error('Failed to list users');
      const found = data.data.users.find((u) => u.id === newOwnerId);
      if (!found || found.storeRating !== 0) throw new Error('Store owner rating missing or incorrect');
    });

    // ----------------------------------------------------
    // 2. NORMAL USER JOURNEY
    // ----------------------------------------------------
    console.log('\n--- 2. NORMAL USER SIGNUP & RATING JOURNEY ---');
    const newUserEmail = `new.customer.${Date.now()}@roxx.com`;
    let customerToken = '';

    await assertTest('Normal User registers via /auth/signup (valid 20-60 name & password rules)', async () => {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Gwendolyn Margaret Customer Test', // 32 chars
          email: newUserEmail,
          password: 'CustPass@2026', // 13 chars (8-16)
          address: '42 Oakridge Valley Lane, Suite 10, Seattle, WA 98101',
        }),
      });
      const data = await res.json();
      if (!data.success || data.data.user.role !== 'USER') throw new Error('Signup failed: ' + JSON.stringify(data));
      customerToken = data.data.token;
    });

    await assertTest('Normal User searches stores by Name and Address', async () => {
      const res = await fetch(`${baseUrl}/stores?search=Liberty`, {
        headers: { Authorization: `Bearer ${customerToken}` },
      });
      const data = await res.json();
      if (!data.success || data.data.stores.length === 0) throw new Error('Search failed');
      const foundStore = data.data.stores.find((s) => s.id === newStoreId);
      if (!foundStore || foundStore.userRating !== null) throw new Error('Store search mismatch');
    });

    await assertTest('Normal User submits a 5-star rating for the store', async () => {
      const res = await fetch(`${baseUrl}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          storeId: newStoreId,
          rating: 5,
        }),
      });
      const data = await res.json();
      if (!data.success || data.data.rating.rating !== 5 || data.data.overallRating !== 5) {
        throw new Error('Rating submission failed: ' + JSON.stringify(data));
      }
    });

    await assertTest('Normal User modifies rating to 4 stars (upsert verification)', async () => {
      const res = await fetch(`${baseUrl}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          storeId: newStoreId,
          rating: 4,
        }),
      });
      const data = await res.json();
      if (!data.success || data.data.rating.rating !== 4 || data.data.overallRating !== 4) {
        throw new Error('Rating update failed: ' + JSON.stringify(data));
      }
    });

    await assertTest('Normal User updates password and logs in with new password', async () => {
      const updateRes = await fetch(`${baseUrl}/auth/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          currentPassword: 'CustPass@2026',
          newPassword: 'BrandPass@2026', // 14 chars
        }),
      });
      const updateData = await updateRes.json();
      if (!updateData.success) throw new Error('Password update failed: ' + JSON.stringify(updateData));

      // Test login with new password
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          password: 'BrandPass@2026',
        }),
      });
      const loginData = await loginRes.json();
      if (!loginData.success) throw new Error('Login with updated password failed');
    });

    // ----------------------------------------------------
    // 3. STORE OWNER JOURNEY
    // ----------------------------------------------------
    console.log('\n--- 3. STORE OWNER DASHBOARD JOURNEY ---');
    let ownerToken = '';
    await assertTest('Store Owner logs in and views dashboard with ratings & average score', async () => {
      const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: ownerEmail,
          password: 'OwnerPass@2026',
        }),
      });
      const loginData = await loginRes.json();
      if (!loginData.success || loginData.data.user.role !== 'STORE_OWNER') {
        throw new Error('Owner login failed');
      }
      ownerToken = loginData.data.token;

      const dashRes = await fetch(`${baseUrl}/store-owner/dashboard`, {
        headers: { Authorization: `Bearer ${ownerToken}` },
      });
      const dashData = await dashRes.json();
      if (!dashData.success || dashData.data.averageRating !== 4 || dashData.data.ratings.length !== 1) {
        throw new Error('Store owner dashboard mismatch: ' + JSON.stringify(dashData));
      }
    });

    // ----------------------------------------------------
    // 4. STRICT VALIDATION & SECURITY ENFORCEMENT
    // ----------------------------------------------------
    console.log('\n--- 4. STRICT VALIDATION & SECURITY RULES ---');
    await assertTest('Rejects Name < 5 characters', async () => {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Sam',
          email: 'short@test.com',
          password: 'ValidPass@123',
          address: 'Valid Address',
        }),
      });
      if (res.status !== 400) throw new Error('Expected 400');
    });

    await assertTest('Rejects Password missing uppercase or special character', async () => {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Valid Name Over Twenty Characters Long',
          email: 'weakpass@test.com',
          password: 'weakpassword',
          address: 'Valid Address',
        }),
      });
      if (res.status !== 400) throw new Error('Expected 400');
    });

    await assertTest('Rejects Rating outside 1-5', async () => {
      const res = await fetch(`${baseUrl}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customerToken}`,
        },
        body: JSON.stringify({
          storeId: newStoreId,
          rating: 6,
        }),
      });
      if (res.status !== 400) throw new Error('Expected 400');
    });

    console.log(`\n========================================`);
    console.log(`🏆 E2E TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runE2EVerification();
