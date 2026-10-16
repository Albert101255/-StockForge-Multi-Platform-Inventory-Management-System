const prisma = require('../config/db.js');

const getItems = async (req, res, next) => {
  try {
    const { search, category, status, sortBy, order, page = 1, limit = 20 } = req.query;

    const where = { isDeleted: false };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    if (category) {
      where.categoryId = parseInt(category);
    }

    if (status) {
      if (status === 'out') {
        where.quantity = 0;
      } else if (status === 'low') {
        where.quantity = { gt: 0, lte: 5 }; // simplistic threshold filter
      } else if (status === 'instock') {
        where.quantity = { gt: 5 };
      }
    }

    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.id = 'desc';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take,
        include: { category: true }
      }),
      prisma.item.count({ where })
    ]);

    res.json({
      data: items,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(take),
        totalPages: Math.ceil(total / take)
      }
    });
  } catch (err) {
    next(err);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.item.findUnique({
      where: { id },
      include: { 
        category: true,
        history: { orderBy: { timestamp: 'desc' } }
      }
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { sku, name, description, quantity, lowStockAt, price, costPrice, supplier, categoryId } = req.body;

    if (!sku || !name || price === undefined || categoryId === undefined) {
      return res.status(400).json({ message: 'sku, name, price, and categoryId are required' });
    }

    const parsedQty = quantity !== undefined && quantity !== '' ? parseInt(quantity, 10) : 0;
    const parsedLowStock = lowStockAt !== undefined && lowStockAt !== '' ? parseInt(lowStockAt, 10) : 5;
    const parsedPrice = parseFloat(price);
    const parsedCostPrice = costPrice !== undefined && costPrice !== '' ? parseFloat(costPrice) : 0;
    const parsedCategoryId = parseInt(categoryId, 10);

    const item = await prisma.$transaction(async (tx) => {
      const existingSku = await tx.item.findUnique({ where: { sku } });
      if (existingSku) {
        const err = new Error('SKU already exists');
        err.statusCode = 400;
        throw err;
      }

      const created = await tx.item.create({
        data: {
          sku,
          name,
          description,
          quantity: Number.isNaN(parsedQty) ? 0 : parsedQty,
          lowStockAt: Number.isNaN(parsedLowStock) ? 5 : parsedLowStock,
          price: parsedPrice,
          costPrice: Number.isNaN(parsedCostPrice) ? 0 : parsedCostPrice,
          supplier,
          categoryId: parsedCategoryId,
          createdById: req.user.userId,
        }
      });

      await tx.stockLog.create({
        data: {
          itemId: created.id,
          delta: Number.isNaN(parsedQty) ? 0 : parsedQty,
          reason: 'Initial Restock'
        }
      });

      return tx.item.findUnique({
        where: { id: created.id },
        include: { category: true, history: { orderBy: { timestamp: 'desc' } } }
      });
    });

    res.status(201).json(item);
  } catch (err) {
    if (err.statusCode === 400) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { sku, name, description, quantity, delta, lowStockAt, price, costPrice, supplier, categoryId, reason } = req.body;

    const updatedItem = await prisma.$transaction(async (tx) => {
      const currentItem = await tx.item.findUnique({ where: { id } });
      if (!currentItem) {
        const err = new Error('Item not found');
        err.statusCode = 404;
        throw err;
      }

      if (sku && sku !== currentItem.sku) {
        const existingSku = await tx.item.findUnique({ where: { sku } });
        if (existingSku) {
          const err = new Error('SKU already exists');
          err.statusCode = 400;
          throw err;
        }
      }

      const data = {};
      if (sku !== undefined) data.sku = sku;
      if (name !== undefined) data.name = name;
      if (description !== undefined) data.description = description;
      if (lowStockAt !== undefined && lowStockAt !== '') data.lowStockAt = parseInt(lowStockAt, 10);
      if (price !== undefined && price !== '') data.price = parseFloat(price);
      if (costPrice !== undefined && costPrice !== '') data.costPrice = parseFloat(costPrice);
      if (supplier !== undefined) data.supplier = supplier;
      if (categoryId !== undefined && categoryId !== '') data.categoryId = parseInt(categoryId, 10);

      let computedDelta = 0;
      if (delta !== undefined && !Number.isNaN(parseInt(delta, 10))) {
        computedDelta = parseInt(delta, 10);
        const targetQuantity = currentItem.quantity + computedDelta;
        if (targetQuantity < 0) {
          const err = new Error('Stock quantity cannot be negative');
          err.statusCode = 400;
          throw err;
        }
        data.quantity = targetQuantity;
      } else if (quantity !== undefined && !Number.isNaN(parseInt(quantity, 10))) {
        const newQuantity = parseInt(quantity, 10);
        if (newQuantity < 0) {
          const err = new Error('Stock quantity cannot be negative');
          err.statusCode = 400;
          throw err;
        }
        if (newQuantity !== currentItem.quantity) {
          computedDelta = newQuantity - currentItem.quantity;
          data.quantity = newQuantity;
        }
      }

      await tx.item.update({
        where: { id },
        data
      });

      if (computedDelta !== 0) {
        await tx.stockLog.create({
          data: {
            itemId: id,
            delta: computedDelta,
            reason: reason || 'Manual adjustment'
          }
        });
      }

      return tx.item.findUnique({
        where: { id },
        include: { category: true, history: { orderBy: { timestamp: 'desc' } } }
      });
    });

    res.json(updatedItem);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Item not found' });

    await prisma.item.update({
      where: { id },
      data: { isDeleted: true }
    });
    res.json({ message: 'Item soft deleted' });
  } catch (err) {
    next(err);
  }
};

const getTrash = async (req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      where: { isDeleted: true },
      include: { category: true }
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const restoreItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = await prisma.item.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'Item not found' });

    await prisma.item.update({
      where: { id },
      data: { isDeleted: false }
    });
    res.json({ message: 'Item restored' });
  } catch (err) {
    next(err);
  }
};

const exportCSV = async (req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      where: { isDeleted: false },
      include: { category: true },
      orderBy: { name: 'asc' }
    });

    const headers = ['ID', 'SKU', 'Name', 'Category', 'Quantity', 'Price', 'Supplier', 'Status'];
    const rows = items.map(item => {
      let status = 'In Stock';
      if (item.quantity === 0) status = 'Out of Stock';
      else if (item.quantity <= item.lowStockAt) status = 'Low Stock';

      return [
        item.id,
        item.sku,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category.name}"`,
        item.quantity,
        item.price,
        `"${item.supplier || ''}"`,
        status
      ].join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=stockforge-inventory.csv');
    res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
};

module.exports = { getItems, getItemById, createItem, updateItem, deleteItem, getTrash, restoreItem, exportCSV };
