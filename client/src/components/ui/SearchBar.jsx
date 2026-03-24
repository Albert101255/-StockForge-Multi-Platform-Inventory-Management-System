import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

export const SearchBar = ({ onSearch, placeholder = "Search SKU, Name...", className }) => {
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebounce(term, 300);

  useEffect(() => {
    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch]);

  return (
    <div className={`relative w-full max-w-md ${className || ''}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-text-secondary" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-border rounded leading-5 bg-elevated text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm font-mono transition-colors"
        placeholder={placeholder}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </div>
  );
};
