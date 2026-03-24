import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import client from '../../api/client';
import { useToast } from '../ui/Toast';

export const ItemForm = ({ initialData, categories, onSuccess, onCancel }) => {
  const isEdit = !!initialData;
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '', sku: '', categoryId: '', quantity: 0,
    lowStockAt: 5, price: '', costPrice: '', supplier: '', description: '',
    reason: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        price: initialData.price.toString(),
        costPrice: initialData.costPrice?.toString() || '',
        reason: ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setFormData(prev => {
      const next = { ...prev, categoryId: catId };
      if (!isEdit && !prev.sku && catId) {
        const cat = categories.find(c => c.id.toString() === catId);
        if (cat) {
          const prefix = cat.name.substring(0, 3).toUpperCase();
          const random4 = Math.floor(1000 + Math.random() * 9000);
          next.sku = `SF-${prefix}-${random4}`;
        }
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        quantity: parseInt(formData.quantity) || 0,
        lowStockAt: parseInt(formData.lowStockAt) || 5,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice) || 0,
      };

      if (isEdit) {
        await client.put(`/items/${initialData.id}`, payload);
        addToast('Item updated successfully');
      } else {
        await client.post('/items', payload);
        addToast('Item created successfully');
      }
      onSuccess();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const qtyChanged = isEdit && parseInt(formData.quantity) !== initialData.quantity;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">Name *</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-sans" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">SKU *</label>
          <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-mono uppercase" />
        </div>
        
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">Category *</label>
          <select required name="categoryId" value={formData.categoryId} onChange={handleCategoryChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-sans">
            <option value="">Select category...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">Quantity *</label>
          <input required type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-mono" />
        </div>

        {qtyChanged && (
          <div className="col-span-2 p-3 bg-warning/10 border border-warning/30 rounded animate-in fade-in">
            <label className="block text-sm text-warning mb-1">Reason for Stock Change *</label>
            <select required name="reason" value={formData.reason} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary outline-none">
              <option value="">Select reason...</option>
              <option value="Restock">Restock (Received new items)</option>
              <option value="Sale">Sale (Manual deduction)</option>
              <option value="Damaged">Damaged / Lost</option>
              <option value="Manual Adjustment">Audit / Manual Adjustment</option>
            </select>
          </div>
        )}

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">Price (Sell) ₹ *</label>
          <input required type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-mono" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">Cost Price ₹</label>
          <input type="number" min="0" step="0.01" name="costPrice" value={formData.costPrice} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-mono" />
        </div>

        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">Low Stock Alert At</label>
          <input type="number" min="0" name="lowStockAt" value={formData.lowStockAt} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-mono" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm text-text-secondary mb-1">Supplier</label>
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-sans" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm text-text-secondary mb-1">Description</label>
          <textarea rows="2" name="description" value={formData.description} onChange={handleChange} className="w-full bg-elevated border border-border rounded p-2 text-text-primary focus:border-accent outline-none font-sans resize-none" />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-border mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Item'}</Button>
      </div>
    </form>
  );
};
