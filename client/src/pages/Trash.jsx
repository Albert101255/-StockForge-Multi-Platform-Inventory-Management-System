import React, { useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import client from '../api/client';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { RotateCcw, ArchiveX } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Trash = () => {
  const { user } = useAuth();
  const { items, fetchTrash, loading } = useInventory();
  const { addToast } = useToast();

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestore = async (id) => {
    try {
      await client.put(`/items/${id}/restore`);
      addToast('Item restored to inventory');
      fetchTrash();
    } catch (err) {
      addToast('Failed to restore item', 'error');
    }
  };

  const columns = [
    { label: 'SKU', key: 'sku', render: (row) => <span className="font-mono text-text-muted line-through">{row.sku}</span> },
    { label: 'Name', key: 'name', render: (row) => <span className="font-medium text-text-primary line-through opacity-50">{row.name}</span> },
    { label: 'Deleted At', key: 'updatedAt', render: (row) => <span className="text-text-muted text-sm">{new Date(row.updatedAt).toLocaleDateString()}</span> },
    { label: 'Actions', key: 'actions', render: (row) => (
      user?.role === 'ADMIN' ? (
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="ghost" className="text-success border border-success/30 hover:bg-success/10 hover:border-success/50 px-3 py-1 font-mono tracking-wider" onClick={() => handleRestore(row.id)}>
            <RotateCcw size={14} className="mr-2"/> RESTORE
          </Button>
        </div>
      ) : <span className="text-xs font-mono text-text-muted border border-border rounded px-2 py-1 bg-elevated">ADMIN ONLY</span>
    )},
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-danger/5 p-6 rounded border border-danger/20 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-5 w-64 h-64 -mt-10 -mr-10 pointer-events-none">
          <ArchiveX size={256} />
        </div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-3 bg-danger/10 rounded-full border border-danger/30">
            <ArchiveX className="text-danger" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-danger tracking-wide flex items-center">
               Restricted Archive
            </h1>
            <p className="text-danger/80 mt-1 font-sans">Soft-deleted items pending permanent destruction or recovery.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-b-4 border-danger/20 rounded shadow-sm opacity-95">
        <Table columns={columns} data={items || []} loading={loading} />
      </div>
    </div>
  );
};

export default Trash;
