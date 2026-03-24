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
    
    // Validate SKU uniqueness
    const existingSku = await prisma.item.findUnique({ where: { sku } });
    if (existingSku) return res.status(400).json({ message: 'SKU already exists' });

    const item = await prisma.item.create({
      data: {
        sku, name, description, 
        quantity: parseInt(quantity) || 0, 
        lowStockAt: parseInt(lowStockAt) || 5, 
        price: parseFloat(price), 
        costPrice: parseFloat(costPrice) || 0,
        supplier, 
        categoryId: parseInt(categoryId),
        createdById: req.user.userId,
        history: {
          create: {
            delta: parseInt(quantity) || 0,
            reason: 'Initial Restock'
          }
        }
      }
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { sku, name, description, quantity, lowStockAt, price, costPrice, supplier, categoryId, reason } = req.body;

    const currentItem = await prisma.item.findUnique({ where: { id } });
    if (!currentItem) return res.status(404).json({ message: 'Item not found' });

    const data = {
      sku, name, description, 
      lowStockAt: parseInt(lowStockAt) || 5, 
      price: parseFloat(price), 
      costPrice: parseFloat(costPrice) || 0,
      supplier, 
      categoryId: parseInt(categoryId)
    };

    let newQuantity = parseInt(quantity);
    if (!isNaN(newQuantity) && newQuantity !== currentItem.quantity) {
      data.quantity = newQuantity;
      data.history = {
        create: {
          delta: newQuantity - currentItem.quantity,
          reason: reason || 'Manual adjustment'
        }
      };
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data
    });

    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
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
    const id = parseInt(req.params.id);
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
