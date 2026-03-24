const express = require('express');
const router = express.Router();
const { getItems, getItemById, createItem, updateItem, deleteItem, getTrash, restoreItem, exportCSV } = require('../controllers/items.controller.js');
const { auth } = require('../middleware/auth.js');

// Order matters: /export and /trash must be above /:id to avoid parsing 'export' as ID
router.get('/export', auth, exportCSV);
router.get('/trash', auth, getTrash);
router.get('/:id', auth, getItemById);
router.get('/', auth, getItems);

router.post('/', auth, createItem);
router.put('/:id', auth, updateItem);
router.delete('/:id', auth, deleteItem);
router.put('/:id/restore', auth, restoreItem);

module.exports = router;
