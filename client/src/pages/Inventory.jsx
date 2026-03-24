import React, { useState, useEffect, useCallback } from 'react';
import { useInventory } from '../hooks/useInventory';
import client from '../api/client';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchBar } from '../components/ui/SearchBar';
import { Modal } from '../components/ui/Modal';
import { ItemForm } from '../components/inventory/ItemForm';
import { useToast } from '../components/ui/Toast';
import { Plus, Download, Edit2, Trash2, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Inventory = () => {
  const { user } = useAuth();
  const { items, pagination, loading, fetchItems } = useInventory();
  const { addToast } = useToast();
  
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'updatedAt', direction: 'desc' });
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Load categories once on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await client.get('/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Fetch items when filters, sort, or page changes
  useEffect(() => {
    fetchItems({
      search: filters.search,
      category: filters.category,
      status: filters.status,
      sortBy: sortConfig.key,
      order: sortConfig.direction,
      page,
      limit: 15
    });
  }, [filters, sortConfig, page, fetchItems]);

  // Function to reload data after mutations
  const reloadData = useCallback(() => {
    fetchItems({
      search: filters.search,
      category: filters.category,
      status: filters.status,
      sortBy: sortConfig.key,
      order: sortConfig.direction,
      page: 1,
      limit: 15
    });
  }, [filters, sortConfig, fetchItems]);

  const handleSearch = (term) => {
    setFilters(prev => ({ ...prev, search: term }));
    setPage(1);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await client.delete(`/items/${id}`);
        addToast('Item sent to trash');
        setPage(1);
        reloadData();
      } catch (err) {
        addToast('Failed to delete item', 'error');
      }
    }
  };

  const handleExport = () => {
    client.get('/items/export', { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'stockforge-inventory.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        addToast('Export downloaded');
      })
      .catch(() => addToast('Export failed', 'error'));
  };

  const columns = [
    { label: 'SKU', key: 'sku', sortable: true, render: (row) => <span className="font-mono text-text-muted">{row.sku}</span> },
    { label: 'Name', key: 'name', sortable: true, render: (row) => <span className="font-medium text-text-primary whitespace-nowrap">{row.name.substring(0, 30)}{row.name.length > 30 ? '...' : ''}</span> },
    { label: 'Category', key: 'categoryId', sortable: false, render: (row) => row.category?.name || '-' },
    { label: 'Price', key: 'price', sortable: true, render: (row) => `₹${parseFloat(row.price).toLocaleString()}` },
    { label: 'Stock', key: 'quantity', sortable: true, render: (row) => (
      <div className="flex items-center space-x-2">
        <span className="font-mono">{row.quantity}</span>
        {row.quantity <= row.lowStockAt && (
          <Badge status={row.quantity === 0 ? 'out' : 'low'}>
            {row.quantity === 0 ? 'OUT' : 'LOW'}
          </Badge>
        )}
      </div>
    )},
    { label: 'Actions', key: 'actions', sortable: false, render: (row) => (
      <div className="flex items-center space-x-3">
        <button onClick={() => { setEditingItem(row); setIsModalOpen(true); }} className="text-text-secondary hover:text-accent transition-colors" title="Edit">
          <Edit2 size={16} />
        </button>
        {user?.role === 'ADMIN' && (
          <button onClick={() => handleDelete(row.id)} className="text-text-secondary hover:text-danger transition-colors" title="Delete">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full min-h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-wide">Inventory Manager</h1>
          <p className="text-text-secondary mt-1 font-sans">View, track, and manage stock levels.</p>
        </div>
        <div className="flex space-x-3 w-full sm:w-auto">
          {user?.role === 'ADMIN' && <Button variant="secondary" onClick={handleExport} className="flex-1 sm:flex-none"><Download size={18} className="mr-2"/> Export CSV</Button>}
          <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex-1 sm:flex-none"><Plus size={18} className="mr-2"/> Add Item</Button>
        </div>
      </div>

      <div className="bg-surface p-4 rounded border border-border flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <SearchBar onSearch={handleSearch} className="w-full md:max-w-md" />
        
        <div className="flex w-full md:w-auto space-x-4">
          <div className="relative flex-1 md:flex-none">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <select 
              className="w-full pl-9 pr-8 py-2 bg-elevated border border-border rounded text-sm text-text-primary focus:border-accent outline-none appearance-none cursor-pointer hover:border-text-muted transition-colors"
              value={filters.category}
              onChange={(e) => { setFilters(prev => ({ ...prev, category: e.target.value })); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <select 
            className="w-full md:w-36 px-3 py-2 bg-elevated border border-border rounded text-sm text-text-primary focus:border-accent outline-none cursor-pointer hover:border-text-muted transition-colors"
            value={filters.status}
            onChange={(e) => { setFilters(prev => ({ ...prev, status: e.target.value })); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="instock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out</option>
          </select>
        </div>
      </div>

      <div className="flex-1 shadow-sm">
        <Table 
          columns={columns} 
          data={items} 
          loading={loading}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-surface p-4 rounded border border-border shadow-sm">
          <span className="text-sm font-mono text-text-secondary">
            Showing {(page - 1) * pagination.limit + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} entries
          </span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <div className="flex items-center px-4 font-mono text-sm bg-elevated rounded border border-border text-accent font-bold">{page} / {pagination.totalPages}</div>
            <Button variant="ghost" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Edit Item' : 'Add New Item'}
      >
        <ItemForm 
          initialData={editingItem} 
          categories={categories}
          onSuccess={() => { setIsModalOpen(false); setPage(1); reloadData(); }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Inventory;
