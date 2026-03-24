import React, { useEffect, useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';
import { StatCard } from '../components/ui/StatCard';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StockByCategory } from '../components/charts/StockByCategory';
import { LowStockGauge } from '../components/charts/LowStockGauge';
import { ValueOverTime } from '../components/charts/ValueOverTime';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { items, fetchItems, loading } = useInventory();
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems({ limit: 1000 });
  }, [fetchItems]);

  const stats = useMemo(() => {
    let totalItems = 0;
    let totalValue = 0;
    let lowStockCount = 0;
    const categories = new Set();

    items.forEach(item => {
      totalItems += 1;
      totalValue += parseFloat(item.price) * item.quantity;
      if (item.quantity <= item.lowStockAt) lowStockCount++;
      if (item.category) categories.add(item.category.id);
    });

    return {
      totalItems,
      totalValue: `₹${totalValue.toLocaleString()}`,
      lowStockCount,
      categoriesCount: categories.size
    };
  }, [items]);

  const lowStockItems = useMemo(() => {
    return items.filter(item => item.quantity <= item.lowStockAt).sort((a, b) => a.quantity - b.quantity).slice(0, 5);
  }, [items]);

  const lowStockColumns = [
    { label: 'Name', key: 'name', sortable: false },
    { label: 'SKU', key: 'sku', sortable: false, render: (row) => <span className="font-mono text-text-muted">{row.sku}</span> },
    { label: 'Quantity', key: 'quantity', sortable: false, render: (row) => (
      <span className={row.quantity === 0 ? "text-danger font-bold" : "text-warning font-bold"}>
        {row.quantity}
      </span>
    )},
    { label: 'Status', key: 'status', sortable: false, render: (row) => (
      <Badge status={row.quantity === 0 ? 'out' : 'low'}>
        {row.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
      </Badge>
    )},
    { label: 'Action', key: 'action', sortable: false, render: (row) => (
      <Button size="sm" variant="ghost" className="text-accent underline pl-0" onClick={() => navigate('/inventory')}>
        Restock
      </Button>
    )}
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary tracking-wide">Command Center</h1>
          <p className="text-text-secondary mt-1 font-sans">System overview and critical alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Items" value={stats.totalItems} iconPath="/assets/icons/icon-box.svg" />
        <StatCard title="Total Value" value={stats.totalValue} iconPath="/assets/icons/icon-coin.svg" />
        <StatCard title="Low Stock Alerts" value={stats.lowStockCount} iconPath="/assets/icons/icon-alert.svg" />
        <StatCard title="Categories" value={stats.categoriesCount} iconPath="/assets/icons/icon-grid.svg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded p-6 lg:col-span-1 shadow-sm">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4">Stock Distribution</h3>
          <StockByCategory items={items} />
        </div>
        
        <div className="bg-surface border border-border rounded p-6 lg:col-span-1 shadow-sm">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4">Inventory Health</h3>
          <LowStockGauge items={items} />
        </div>

        <div className="bg-surface border border-border rounded p-6 lg:col-span-1 shadow-sm">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4">Value Over Time</h3>
          <ValueOverTime items={items} />
        </div>
      </div>

      <div className="bg-surface border border-border rounded p-6 shadow-sm">
        <h3 className="text-lg font-display font-semibold flex items-center text-text-primary mb-4">
          <span className="w-2 h-2 rounded-full bg-danger mr-2 animate-pulse"></span>
          Critical Restock Needs
        </h3>
        <Table columns={lowStockColumns} data={lowStockItems} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
