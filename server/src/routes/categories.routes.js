const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categories.controller.js');
const { adminAuth, auth } = require('../middleware/auth.js');

// Everyone (staff + admin) can view categories
router.get('/', auth, getCategories);

// Only admins can modify categories
router.post('/', adminAuth, createCategory);
router.put('/:id', adminAuth, updateCategory);
router.delete('/:id', adminAuth, deleteCategory);

module.exports = router;
