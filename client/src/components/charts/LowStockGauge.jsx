import React, { useMemo } from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export const LowStockGauge = ({ items }) => {
  const data = useMemo(() => {
    let inStock = 0, lowStock = 0, outOfStock = 0;
    items.forEach(item => {
      if (item.quantity === 0) outOfStock++;
      else if (item.quantity <= item.lowStockAt) lowStock++;
      else inStock++;
    });

    return [
      { name: 'Out of Stock', count: outOfStock, fill: '#E94560' }, // danger
      { name: 'Low Stock', count: lowStock, fill: '#F5C542' },    // warning
      { name: 'In Stock', count: inStock, fill: '#0F9B58' }       // success
    ];
  }, [items]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" cy="50%" 
          innerRadius="30%" outerRadius="100%" 
          barSize={15} data={data}
          startAngle={180} endAngle={0}
        >
          <RadialBar minAngle={15} background={{ fill: '#242424' }} clockWise={true} dataKey="count" />
          <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2E2E2E', color: '#F0F0F0' }} />
          <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" wrapperStyle={{ top: 0, left: '60%', lineHeight: '24px' }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};
