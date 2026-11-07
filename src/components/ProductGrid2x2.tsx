import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ChevronLeft, ChevronRight, LayoutGrid, Grid3x3 } from 'lucide-react';

interface ProductGrid2x2Props {
  products: Product[];
  onOpenSpecs: (product: Product) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const ProductGrid2x2: React.FC<ProductGrid2x2Props> = ({
  products,
  onOpenSpecs,
  onAddToCart,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4); // 4 items = 2x2 grid per viewport screen

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = Math.ceil(products.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto my-6 space-y-2 text-slate-900 shadow-xl">
        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto text-base font-bold">
          !
        </div>
        <h3 className="text-base font-bold text-slate-900">No LED Models Found</h3>
        <p className="text-xs text-slate-600">
          Try resetting category tabs or search keywords to view available wholesale models.
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-5 space-y-3 sm:space-y-4">
      {/* Sleek Pagination & View Mode Strip (No heavy banner) */}
      <div className="flex items-center justify-between gap-2 bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-300">
        <div className="flex items-center gap-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-200">
            Wholesale Catalog ({products.length} Models)
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => {
                setItemsPerPage(4);
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 transition-colors ${
                itemsPerPage === 4
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="2x2 Screen View (4 items)"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>2×2</span>
            </button>

            <button
              onClick={() => {
                setItemsPerPage(8);
                setCurrentPage(1);
              }}
              className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 transition-colors ${
                itemsPerPage === 8
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Expanded 8 items"
            >
              <Grid3x3 className="w-3 h-3" />
              <span>All</span>
            </button>
          </div>

          {/* Page Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="text-slate-300 font-bold px-1">
                <strong className="text-amber-400">{currentPage}</strong>/{totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2x2 Grid Layout: Strictly 2 columns x 2 rows on mobile & desktop */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 min-h-[480px]">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenSpecs={onOpenSpecs}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Pagination dots bar for mobile & desktop */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all ${
                  currentPage === idx + 1
                    ? 'bg-amber-500 text-slate-950 font-black scale-105 shadow'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
