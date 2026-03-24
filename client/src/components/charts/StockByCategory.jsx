import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const StockByCategory = ({ items }) => {
  const data = useMemo(() => {
    const categoryMap = {};
    items.forEach(item => {
      const catName = item.category?.name || 'Unknown';
      if (!categoryMap[catName]) categoryMap[catName] = 0;
      categoryMap[catName] += item.quantity;
    });
    return Object.entries(categoryMap).map(([name, qty]) => ({ name, qty }));
  }, [items]);

  return (
    <div className="h-64 w-full cursor-pointer hover:opacity-90 transition-opacity">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" stroke="#8A8A8A" />
          <YAxis dataKey="name" type="category" stroke="#8A8A8A" width={100} tick={{ fill: '#F0F0F0' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2E2E2E', color: '#F0F0F0' }}
            itemStyle={{ color: '#F5A623' }}
            cursor={{ fill: '#242424' }}
          />
          <Bar dataKey="qty" fill="#F5A623" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
