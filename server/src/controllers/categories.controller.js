const prisma = require('../config/db.js');

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { items: true }
        }
      }
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, iconSlug } = req.body;
    const category = await prisma.category.create({
      data: { name, iconSlug }
    });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name, iconSlug } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, iconSlug }
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    
    // Check if category has items
    const count = await prisma.item.count({ where: { categoryId: id } });
    if (count > 0) {
      return res.status(400).json({ message: 'Cannot delete category with associated items' });
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
