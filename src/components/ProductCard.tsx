import React from 'react';
import { Product } from '../types';
import { Info, PlusCircle, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenSpecs: (product: Product) => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenSpecs,
  onAddToCart,
}) => {
  const lowestTierPrice = Math.min(...product.tiers.map((t) => t.unitPrice));
  const highestTierPrice = Math.max(...product.tiers.map((t) => t.unitPrice));

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:border-amber-500/80 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col h-full group text-slate-900">
      {/* Top Image Container */}
      <div
        className="relative aspect-[4/3] bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onOpenSpecs(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1.5">
          <span className="bg-slate-900/90 text-amber-400 font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow">
            {product.specs.wattage}
          </span>

          <span
            className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow ${
              product.inStock
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {product.inStock ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden xs:inline">In Stock</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3" />
                <span>Pre-Order</span>
              </>
            )}
          </span>
        </div>

        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1 rounded-full border border-slate-300 shadow-lg flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span>Click for Details</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono mb-0.5">
            <span className="truncate">{product.category}</span>
            <span className="text-slate-400 font-medium shrink-0">{product.modelCode}</span>
          </div>

          <h3
            onClick={() => onOpenSpecs(product)}
            className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 cursor-pointer leading-tight sm:leading-snug"
          >
            {product.name}
          </h3>
        </div>

        {/* Dynamic Wholesale Tier Price Preview */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-2 sm:p-2.5 space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] sm:text-[11px] text-slate-600 font-medium">Wholesale Rate:</span>
            <div className="text-right">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 font-mono">
                ₹{lowestTierPrice.toFixed(2)}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-mono"> - ₹{highestTierPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* MOQ Baseline */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] border-t border-slate-200 pt-1 text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Layers className="w-3 h-3 text-amber-500" />
              <span>MOQ: <strong className="text-slate-900 font-mono">{product.moq} pcs</strong></span>
            </span>
            <span className="text-[10px] text-emerald-700 font-mono font-bold">
              Save {Math.round(((highestTierPrice - lowestTierPrice) / highestTierPrice) * 100)}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
          <button
            onClick={() => onOpenSpecs(product)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[11px] sm:text-xs font-semibold py-1.5 sm:py-2 px-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onAddToCart(product, product.moq)}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] sm:text-xs font-bold py-1.5 sm:py-2 px-1.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add {product.moq}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
