"use client";

import { Filter, ChevronDown } from 'lucide-react';

export default function ProductFilter() {
  const categories = ['All', 'Streaming', 'Software', 'Gaming', 'Creative'];
  const sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Most Popular'];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-border mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-text-muted" />
          <span className="font-semibold text-text-primary">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                cat === 'All' 
                  ? 'bg-primary text-white font-medium' 
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-text-secondary whitespace-nowrap">Sort by:</span>
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-border text-sm rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-primary">
              {sortOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-2.5 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
