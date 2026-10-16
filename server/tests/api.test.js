const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');

const testDbPath = path.join(__dirname, '..', 'prisma', 'test.db');
process.env.DATABASE_URL = 'file:./test.db';
delete process.env.JWT_SECRET; // Verify default JWT secret consistency between sign and verify

execSync('npx prisma db push --skip-generate', {
  cwd: path.join(__dirname, '..'),
  env: { ...process.env, DATABASE_URL: 'file:./test.db' },
  stdio: 'ignore',
});

const app = require('../src/index.js');
const prisma = require('../src/config/db.js');

let server;
let baseUrl;
let staffToken;
let adminToken;
let categoryId;
let itemId;

async function request(method, route, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${route}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text();

  return { status: res.status, data, headers: res.headers };
}

describe('StockForge Backend API', () => {
  before(async () => {
    await prisma.stockLog.deleteMany();
    await prisma.item.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await prisma.$disconnect();
    for (const suffix of ['', '-journal', '-wal', '-shm']) {
      const file = `${testDbPath}${suffix}`;
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    }
  });

  test('GET /health returns status ok', async () => {
    const res = await request('GET', '/health');
    assert.equal(res.status, 200);
    assert.equal(res.data.status, 'ok');
  });

  test('Auth: register, login, and verify /api/auth/me token roundtrip', async () => {
    const regRes = await request('POST', '/api/auth/register', {
      body: {
        name: 'Test Staff',
        email: 'staff@test.local',
        password: 'Password123!',
      },
    });
    assert.equal(regRes.status, 201);
    assert.ok(regRes.data.token);
    assert.equal(regRes.data.user.role, 'STAFF');
    staffToken = regRes.data.token;

    // Duplicate registration should fail with 400
    const dupRes = await request('POST', '/api/auth/register', {
      body: {
        name: 'Duplicate',
        email: 'staff@test.local',
        password: 'Password123!',
      },
    });
    assert.equal(dupRes.status, 400);

    // Verify token works on protected endpoint /api/auth/me
    const meRes = await request('GET', '/api/auth/me', { token: staffToken });
    assert.equal(meRes.status, 200);
    assert.equal(meRes.data.user.email, 'staff@test.local');

    // Create an admin user and login
    const adminReg = await request('POST', '/api/auth/register', {
      body: {
        name: 'Test Admin',
        email: 'admin@test.local',
        password: 'AdminPassword123!',
      },
    });
    assert.equal(adminReg.status, 201);
    await prisma.user.update({
      where: { email: 'admin@test.local' },
      data: { role: 'ADMIN' },
    });

    const loginRes = await request('POST', '/api/auth/login', {
      body: {
        email: 'admin@test.local',
        password: 'AdminPassword123!',
      },
    });
    assert.equal(loginRes.status, 200);
    assert.equal(loginRes.data.user.role, 'ADMIN');
    adminToken = loginRes.data.token;
  });

  test('Categories: enforces RBAC and prevents deleting categories with items', async () => {
    // Staff cannot create categories
    const forbiddenRes = await request('POST', '/api/categories', {
      token: staffToken,
      body: { name: 'Consoles', iconSlug: 'icon-console.svg' },
    });
    assert.equal(forbiddenRes.status, 403);

    // Admin can create categories
    const createRes = await request('POST', '/api/categories', {
      token: adminToken,
      body: { name: 'Consoles', iconSlug: 'icon-console.svg' },
    });
    assert.equal(createRes.status, 201);
    assert.equal(createRes.data.name, 'Consoles');
    categoryId = createRes.data.id;

    // Staff can list categories
    const listRes = await request('GET', '/api/categories', { token: staffToken });
    assert.equal(listRes.status, 200);
    assert.equal(listRes.data.length, 1);
  });

  test('Items: transactional creation, stock adjustments with StockLog, soft delete, restore, and CSV export', async () => {
    const createRes = await request('POST', '/api/items', {
      token: staffToken,
      body: {
        sku: 'SF-CON-001',
        name: 'PlayStation 5 Pro',
        description: 'Next-gen console',
        quantity: 10,
        lowStockAt: 3,
        price: 49999,
        costPrice: 42000,
        supplier: 'Sony Interactive',
        categoryId,
      },
    });
    assert.equal(createRes.status, 201);
    assert.equal(createRes.data.quantity, 10);
    assert.equal(createRes.data.history.length, 1);
    assert.equal(createRes.data.history[0].delta, 10);
    assert.equal(createRes.data.history[0].reason, 'Initial Restock');
    itemId = createRes.data.id;

    // Duplicate SKU should be rejected
    const dupSkuRes = await request('POST', '/api/items', {
      token: staffToken,
      body: {
        sku: 'SF-CON-001',
        name: 'Duplicate SKU Item',
        quantity: 5,
        price: 1000,
        categoryId,
      },
    });
    assert.equal(dupSkuRes.status, 400);

    // Update stock quantity from 10 to 16 (+6 restock)
    const updateRes = await request('PUT', `/api/items/${itemId}`, {
      token: staffToken,
      body: {
        quantity: 16,
        reason: 'Restock',
      },
    });
    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.data.quantity, 16);
    assert.equal(updateRes.data.history.length, 2);
    assert.ok(updateRes.data.history.some((h) => h.delta === 6 && h.reason === 'Restock'));

    // Reject negative stock quantity
    const negRes = await request('PUT', `/api/items/${itemId}`, {
      token: staffToken,
      body: {
        quantity: -5,
        reason: 'Invalid adjustment',
      },
    });
    assert.equal(negRes.status, 400);

    // Export CSV
    const csvRes = await request('GET', '/api/items/export', { token: adminToken });
    assert.equal(csvRes.status, 200);
    assert.match(csvRes.data, /SF-CON-001/);
    assert.match(csvRes.data, /PlayStation 5 Pro/);

    // Soft delete item
    const delRes = await request('DELETE', `/api/items/${itemId}`, { token: adminToken });
    assert.equal(delRes.status, 200);

    // Active list should now be empty, trash should have 1 item
    const activeList = await request('GET', '/api/items', { token: staffToken });
    assert.equal(activeList.data.data.length, 0);

    const trashList = await request('GET', '/api/items/trash', { token: staffToken });
    assert.equal(trashList.data.length, 1);
    assert.equal(trashList.data[0].id, itemId);

    // Restore item from trash
    const restoreRes = await request('PUT', `/api/items/${itemId}/restore`, { token: adminToken });
    assert.equal(restoreRes.status, 200);

    const activeAfterRestore = await request('GET', '/api/items', { token: staffToken });
    assert.equal(activeAfterRestore.data.data.length, 1);
  });
});
