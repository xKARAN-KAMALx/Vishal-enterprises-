import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

interface SlimCategoryBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  totalProductsCount: number;
  activeFilterCount: number;
  onResetFilters: () => void;
}

export const SlimCategoryBar: React.FC<SlimCategoryBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  totalProductsCount,
  activeFilterCount,
  onResetFilters,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur border-y border-slate-200 sticky top-[57px] z-20 shadow-xs text-slate-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-mono pr-2 border-r border-slate-200 shrink-0 font-medium">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Category:</span>
          </div>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-600 font-mono">
          <span>Models: <strong className="text-amber-700 font-extrabold">{totalProductsCount}</strong></span>
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-slate-500 hover:text-amber-700 font-semibold transition-colors"
              title="Reset category and search filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
