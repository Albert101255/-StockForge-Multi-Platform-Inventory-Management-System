const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.stockLog.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const staffPassword = await bcrypt.hash('Staff@1234', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@stockforge.dev',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@stockforge.dev',
      password: staffPassword,
      name: 'Staff User',
      role: 'STAFF',
    },
  });

  console.log('Created users');

  const categoriesData = [
    { name: 'PS5 Games', iconSlug: 'icon-games.svg' },
    { name: 'PC Games', iconSlug: 'icon-games.svg' },
    { name: 'Consoles', iconSlug: 'icon-console.svg' },
    { name: 'Accessories', iconSlug: 'icon-accessories.svg' },
    { name: 'Merch', iconSlug: 'icon-merch.svg' }
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories.push(created);
  }

  console.log('Created categories');

  const itemsData = [
    // PS5 Games
    { name: "God of War Ragnarök", sku: "SF-PS5-1001", quantity: 15, price: 4999, costPrice: 3500 },
    { name: "Spider-Man 2", sku: "SF-PS5-1002", quantity: 4, lowStockAt: 5, price: 4999, costPrice: 3800 },
    { name: "Final Fantasy XVI", sku: "SF-PS5-1003", quantity: 20, price: 4500, costPrice: 3200 },
    { name: "Horizon Forbidden West", sku: "SF-PS5-1004", quantity: 0, price: 3999, costPrice: 2800 },
    { name: "Demon's Souls", sku: "SF-PS5-1005", quantity: 12, price: 4999, costPrice: 3500 },
    { name: "Ratchet & Clank", sku: "SF-PS5-1006", quantity: 8, price: 3999, costPrice: 2800 },
    { name: "Returnal", sku: "SF-PS5-1007", quantity: 6, price: 4999, costPrice: 3500 },
    { name: "Ghost of Tsushima DC", sku: "SF-PS5-1008", quantity: 25, price: 2999, costPrice: 2000 },
    { name: "The Last of Us Part I", sku: "SF-PS5-1009", quantity: 18, price: 4999, costPrice: 3500 },
    { name: "Gran Turismo 7", sku: "SF-PS5-1010", quantity: 3, lowStockAt: 5, price: 4999, costPrice: 3500 },
    // Accessories
    { name: "DualSense Wireless Controller", sku: "SF-ACC-2001", quantity: 45, price: 5990, costPrice: 4800 },
    { name: "Pulse 3D Wireless Headset", sku: "SF-ACC-2002", quantity: 12, price: 8590, costPrice: 6500 },
    { name: "Logitech G502 X", sku: "SF-ACC-2003", quantity: 20, price: 7995, costPrice: 6000 },
    { name: "Razer DeathAdder V3", sku: "SF-ACC-2004", quantity: 15, price: 6500, costPrice: 5000 },
    { name: "SteelSeries Apex Pro", sku: "SF-ACC-2005", quantity: 5, lowStockAt: 8, price: 18999, costPrice: 15000 },
    { name: "HyperX Cloud III", sku: "SF-ACC-2006", quantity: 30, price: 8990, costPrice: 7000 },
    { name: "Corsair K70 RGB PRO", sku: "SF-ACC-2007", quantity: 10, price: 14500, costPrice: 11000 },
    { name: "Xbox Wireless Controller", sku: "SF-ACC-2008", quantity: 50, price: 5390, costPrice: 4200 },
    { name: "Elgato Stream Deck MK.2", sku: "SF-ACC-2009", quantity: 1, lowStockAt: 5, price: 13999, costPrice: 11500 },
    { name: "Blue Yeti USB Mic", sku: "SF-ACC-2010", quantity: 14, price: 10995, costPrice: 8500 }
  ];

  let catIndex = 0;
  for (let i = 21; i <= 50; i++) {
    const isLow = i % 7 === 0;
    const isOut = i % 13 === 0;
    let qty = isOut ? 0 : (isLow ? Math.floor(Math.random() * 4) + 1 : Math.floor(Math.random() * 50) + 10);
    itemsData.push({
      name: `Generic Item ${i}`,
      sku: `SF-GEN-${3000 + i}`,
      quantity: qty,
      lowStockAt: 5,
      price: 1500 + (i * 100),
      costPrice: 1000 + (i * 80)
    });
  }

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);

  for (let i = 0; i < itemsData.length; i++) {
    const cat = categories[i % 5];
    const data = itemsData[i];
    
    // Spread dates over the last 5 months
    const itemDate = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));
    
    await prisma.item.create({
      data: {
        ...data,
        categoryId: cat.id,
        createdById: admin.id,
        createdAt: itemDate,
        updatedAt: itemDate,
        history: {
          create: {
            delta: data.quantity,
            reason: 'Initial Restock',
            timestamp: itemDate
          }
        }
      }
    });
  }

  console.log(`Created ${itemsData.length} items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
