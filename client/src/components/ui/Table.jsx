import React from 'react';
import { ArrowDownAZ, ArrowUpZA, ArrowUpDown } from 'lucide-react';

export const Table = ({ columns, data, onSort, sortConfig, loading }) => {
  return (
    <div className="w-full overflow-x-auto rounded border border-border bg-surface">
      <table className="w-full text-left border-collapse">
        <thead className="bg-elevated border-b border-border">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`py-3 px-4 font-mono text-sm font-semibold text-text-secondary uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:bg-base/50 transition-colors' : ''}`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <span>{col.label}</span>
                  {col.sortable && sortConfig?.key === col.key && (
                    sortConfig.direction === 'asc' ? <ArrowUpZA size={14} className="text-accent" /> : <ArrowDownAZ size={14} className="text-accent" />
                  )}
                  {col.sortable && sortConfig?.key !== col.key && (
                    <ArrowUpDown size={14} className="text-text-muted opacity-50" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-text-muted">
                Loading data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-text-muted font-sans hidden-border">
                No matching records found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr 
                key={row.id || rowIdx} 
                className="border-b border-border hover:bg-elevated/50 transition-colors duration-150 group"
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="py-3 px-4 font-sans text-sm text-text-primary">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
