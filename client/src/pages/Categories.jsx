import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Categories = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', iconSlug: 'icon-games.svg' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await client.get('/categories');
      setCategories(res.data);
    } catch (err) {
      addToast('Failed to load categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Note: Categories with associated items cannot be deleted.')) {
      try {
        await client.delete(`/categories/${id}`);
        addToast('Category deleted successfully');
        fetchCategories();
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete category', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await client.put(`/categories/${editingCat.id}`, formData);
        addToast('Category updated');
      } else {
        await client.post('/categories', formData);
        addToast('Category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save category', 'error');
    }
  };

  const columns = [
    { label: 'Icon', key: 'icon', render: (row) => (
      <div className="w-10 h-10 bg-elevated border border-border rounded flex items-center justify-center">
        <img src={`/assets/icons/${row.iconSlug}`} alt="icon" className="w-6 h-6" onError={(e) => {e.target.style.display='none'}} />
      </div>
    )},
    { label: 'Name', key: 'name', render: (row) => <span className="font-display font-semibold text-lg text-text-primary tracking-wide">{row.name}</span> },
    { label: 'Total Items', key: 'count', render: (row) => <span className="font-mono text-text-secondary bg-elevated px-2 py-1 rounded inline-block">{row._count?.items || 0}</span> },
    { label: 'Actions', key: 'actions', render: (row) => (
      user?.role === 'ADMIN' ? (
        <div className="flex items-center space-x-3">
          <button onClick={() => { setEditingCat(row); setFormData({ name: row.name, iconSlug: row.iconSlug }); setIsModalOpen(true); }} className="text-text-secondary hover:text-accent transition-colors">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-danger transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      ) : <span className="text-xs font-mono text-text-muted border border-border rounded px-2 py-1 bg-elevated">ADMIN ONLY</span>
    )},
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-surface p-6 rounded border border-border shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-elevated rounded-full">
            <FolderTree className="text-accent" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-text-primary tracking-wide">Categories</h1>
            <p className="text-text-secondary mt-1 font-sans">Manage item classifications and system icons.</p>
          </div>
        </div>
        {user?.role === 'ADMIN' && (
          <Button onClick={() => { setEditingCat(null); setFormData({ name: '', iconSlug: 'icon-games.svg' }); setIsModalOpen(true); }}>
            <Plus size={18} className="mr-2"/> New Category
          </Button>
        )}
      </div>

      <div className="shadow-sm">
        <Table columns={columns} data={categories} loading={loading} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCat ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">Category Name *</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-elevated border border-border rounded p-3 text-text-primary focus:border-accent outline-none font-sans" placeholder="e.g. Action Figures" />
          </div>
          <div>
            <label className="block text-sm text-text-secondary mb-1">Icon SVG Reference *</label>
            <select required value={formData.iconSlug} onChange={(e) => setFormData({...formData, iconSlug: e.target.value})} className="w-full bg-elevated border border-border rounded p-3 text-text-primary focus:border-accent outline-none font-mono">
              <option value="icon-games.svg">icon-games.svg (Cartridge)</option>
              <option value="icon-console.svg">icon-console.svg (Controller)</option>
              <option value="icon-accessories.svg">icon-accessories.svg (Headset)</option>
              <option value="icon-merch.svg">icon-merch.svg (T-shirt)</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
