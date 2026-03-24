import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const ValueOverTime = ({ items }) => {
  const data = useMemo(() => {
    const currentTotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const trend = [];
    let movingTotal = currentTotal * 0.7; // mock start
    const step = (currentTotal - movingTotal) / 30;
    
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const noise = (Math.random() - 0.5) * step * 5;
      movingTotal += step + noise;
      
      if (i === 0) movingTotal = currentTotal;
      
      trend.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(movingTotal)
      });
    }
    return trend;
  }, [items]);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#242424" vertical={false} />
          <XAxis dataKey="date" stroke="#8A8A8A" tick={{ fill: '#8A8A8A', fontSize: 12 }} />
          <YAxis stroke="#8A8A8A" tick={{ fill: '#8A8A8A', fontSize: 12 }} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2E2E2E', color: '#F0F0F0' }}
            itemStyle={{ color: '#F5A623' }}
            formatter={(value) => [`₹${value.toLocaleString()}`, 'Value']}
          />
          <Line type="monotone" dataKey="value" stroke="#F5A623" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#F5A623', stroke: '#1A1A1A', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
