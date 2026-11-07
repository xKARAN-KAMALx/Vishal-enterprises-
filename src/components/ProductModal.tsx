import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShieldCheck, Zap, Layers, MessageSquare, Plus, Minus, ShoppingBag } from 'lucide-react';
import { BUSINESS_INFO } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState<number>(product.moq);

  const getUnitPriceForQty = (qty: number): number => {
    let price = product.basePrice;
    for (const tier of product.tiers) {
      if (qty >= tier.minQty) {
        if (!tier.maxQty || qty <= tier.maxQty) {
          price = tier.unitPrice;
          break;
        } else {
          price = tier.unitPrice;
        }
      }
    }
    return price;
  };

  const currentUnitPrice = getUnitPriceForQty(quantity);
  const subtotal = currentUnitPrice * quantity;
  const gstAmount = subtotal * 0.18;
  const grandTotal = subtotal + gstAmount;

  const handleQtyChange = (delta: number) => {
    const step = product.moq >= 500 ? 100 : product.moq >= 100 ? 50 : 10;
    const newQty = Math.max(product.moq, quantity + delta * step);
    setQuantity(newQty);
  };

  const handleWhatsAppBuyNow = () => {
    const text = encodeURIComponent(
      `Hello VS Enterprises,\nI want to place an order / buy now:\n\n` +
      `📦 Item: ${product.name} (${product.modelCode})\n` +
      `🔢 Quantity: ${quantity} pcs\n` +
      `🏷️ Rate: ₹${currentUnitPrice.toFixed(2)} / pc\n` +
      `💵 Subtotal: ₹${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n` +
      `📑 GST (18%): ₹${gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n` +
      `💰 Grand Total: ₹${grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n\n` +
      `Please confirm stock & dispatch.`
    );
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl my-auto relative space-y-0">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors border border-slate-300 shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Product Image & Overview */}
          <div className="md:col-span-5 bg-slate-50 p-4 sm:p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="space-y-3">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-slate-900 text-amber-400 font-bold font-mono text-xs px-2 py-0.5 rounded shadow">
                  {product.specs.wattage}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-amber-700 font-mono font-bold block uppercase">
                  {product.category} · {product.modelCode}
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug mt-0.5">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-700 space-y-1 shadow-sm">
                <div className="flex justify-between">
                  <span>Box Packaging:</span>
                  <strong className="text-amber-700">{product.specs.pcsPerBox} Pcs / Box</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Stock Status:</span>
                  <strong className="text-emerald-700">{product.stockCount.toLocaleString()} Ready Pcs</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-3">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{product.specs.warranty}</span>
            </div>
          </div>

          {/* Right Column: Wholesale Pricing Tiers & Actions */}
          <div className="md:col-span-7 p-4 sm:p-5 space-y-4">
            {/* Tier Rates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-amber-600" />
                  <span>Wholesale MOQ Tiers</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">MOQ: <strong className="text-slate-900">{product.moq} pcs</strong></span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {product.tiers.map((tier, idx) => {
                  const isCurrent =
                    quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty);
                  return (
                    <div
                      key={idx}
                      onClick={() => setQuantity(tier.minQty)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all text-center ${
                        isCurrent
                          ? 'bg-amber-50 border-amber-500 text-slate-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-[10px] text-slate-500">
                        {tier.maxQty ? `${tier.minQty}-${tier.maxQty} pcs` : `${tier.minQty}+ pcs`}
                      </div>
                      <div className="text-sm font-extrabold text-amber-600 mt-0.5">
                        ₹{tier.unitPrice.toFixed(2)}
                      </div>
                      <div className="text-[9px] text-slate-500">/ pc</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tech Specs */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Technical Specifications</span>
              </h3>

              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Driver</span>
                  <span className="text-slate-900 font-semibold truncate block">{product.specs.driverType}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Lumens</span>
                  <span className="text-slate-900 font-semibold truncate block">{product.specs.lumens}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Color Temp</span>
                  <span className="text-slate-900 font-semibold truncate block">{product.specs.colorTemp}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Voltage</span>
                  <span className="text-slate-900 font-semibold truncate block">{product.specs.operatingVoltage}</span>
                </div>
              </div>
            </div>

            {/* Stepper & Calculator */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 font-mono">Quantity:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleQtyChange(-1)}
                    disabled={quantity <= product.moq}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-800 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="number"
                    min={product.moq}
                    step={10}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                    className="w-20 text-center bg-white border border-slate-300 rounded-lg py-1 text-sm font-extrabold text-amber-700 font-mono focus:outline-none focus:border-amber-500"
                  />

                  <button
                    onClick={() => handleQtyChange(1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Unit Rate:</span>
                  <span className="text-amber-700 font-bold">₹{currentUnitPrice.toFixed(2)} / pc</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="text-slate-900 font-bold">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%):</span>
                  <span>₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                  <span>Grand Total:</span>
                  <span className="text-amber-600 font-mono text-base">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add {quantity} Pcs</span>
              </button>

              <button
                onClick={handleWhatsAppBuyNow}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-2.5 px-2.5 rounded-xl transition-colors shadow flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Buy via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
