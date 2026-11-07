import React from 'react';
import { CartItem } from '../types';
import { ShoppingCart, Trash2, ArrowRight, Package } from 'lucide-react';

interface FloatingCartBarProps {
  cartItems: CartItem[];
  onOpenCartDrawer: () => void;
  onClearCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  cartItems,
  onOpenCartDrawer,
  onClearCart,
}) => {
  if (cartItems.length === 0) return null;

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const gstAmount = subtotal * 0.18;
  const grandTotal = subtotal + gstAmount;

  return (
    <div className="sticky bottom-[46px] z-25 max-w-7xl mx-auto px-3 sm:px-4 py-2 pointer-events-none">
      <div className="bg-white/95 backdrop-blur border border-amber-500/80 shadow-2xl rounded-2xl p-3 sm:p-3.5 pointer-events-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-900">
        {/* Left Side: Cart Items Summary */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-amber-400 font-mono text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-amber-500">
              {cartItems.length}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-slate-900 font-extrabold text-xs sm:text-sm flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>{totalQuantity.toLocaleString()} Units Selected</span>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-medium">({cartItems.length} Models)</span>
            </div>

            <div className="text-[11px] text-slate-600 font-mono">
              Est. Total: <strong className="text-amber-700 font-extrabold text-xs sm:text-sm">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
              <span className="text-[10px] text-slate-500 ml-1">(incl. 18% GST)</span>
            </div>
          </div>
        </div>

        {/* Right Side: View Details & Clear Cart Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onClearCart}
            className="px-2.5 py-1.5 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
            title="Clear all items from cart"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>

          <button
            onClick={onOpenCartDrawer}
            className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-1.5 rounded-xl text-xs shadow transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>View Cart Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
