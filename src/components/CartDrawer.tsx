import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, MessageSquare, Download, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO, LOGO_IMAGE } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenOrderNowModal: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenOrderNowModal,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerGst, setCustomerGst] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const gstAmount = subtotal * 0.18;
  const grandTotal = subtotal + gstAmount;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleWhatsAppOrder = () => {
    let message = `*WHOLESALE LED BULB ORDER - VS ENTERPRISES*\n`;
    message += `───────────────────────\n`;
    message += `👤 Buyer: ${customerName || 'B2B Wholesale Customer'}\n`;
    if (customerCity) message += `📍 Location: ${customerCity}\n`;
    if (customerGst) message += `📑 Buyer GSTIN: ${customerGst}\n`;
    message += `📅 Date: ${new Date().toLocaleDateString('en-IN')}\n`;
    message += `───────────────────────\n\n`;
    message += `*ORDERED ITEMS LIST:*\n`;

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   Code: ${item.product.modelCode}\n`;
      message += `   Qty: ${item.quantity} pcs @ ₹${item.calculatedUnitPrice.toFixed(2)}/pc\n`;
      message += `   Amount: ₹${item.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n\n`;
    });

    message += `───────────────────────\n`;
    message += `💵 Subtotal: ₹${subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    message += `📄 18% GST: ₹${gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
    message += `💰 *GRAND TOTAL ESTIMATE: ₹${grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}*\n`;
    message += `───────────────────────\n`;
    message += `Please issue Proforma Invoice and dispatch timeline.`;

    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadQuotation = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = cartItems
      .map(
        (item, idx) => `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #ddd;">${idx + 1}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;">
            <strong>${item.product.name}</strong><br/>
            <small>${item.product.modelCode} | ${item.product.specs.wattage}</small>
          </td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${item.quantity} pcs</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">₹${item.calculatedUnitPrice.toFixed(2)}</td>
          <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">₹${item.totalPrice.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>VS Enterprises - Wholesale Proforma Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #f2f2f2; padding: 8px; text-align: left; border-bottom: 2px solid #ddd; }
            .totals { margin-left: auto; width: 300px; text-align: right; margin-top: 20px; font-size: 14px; }
            .totals tr td { padding: 4px 0; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin:0;">VS ENTERPRISES</h1>
              <p style="margin:4px 0;">Wholesale LED Bulbs & Commercial Lighting Depot</p>
              <p style="margin:2px 0;">Owner: ${BUSINESS_INFO.ownerName} | Ph: ${BUSINESS_INFO.phonePrimary}</p>
            </div>
            <div style="text-align:right;">
              <h2>PROFORMA QUOTATION</h2>
              <p>Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <strong>Customer Details:</strong> ${customerName || 'B2B Customer'} ${customerCity ? `(${customerCity})` : ''}<br/>
            <strong>GSTIN:</strong> ${customerGst || 'N/A'}
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Rate</th>
                <th style="text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr><td>Subtotal:</td><td>₹${subtotal.toFixed(2)}</td></tr>
              <tr><td>GST (18%):</td><td>₹${gstAmount.toFixed(2)}</td></tr>
              <tr class="grand-total"><td>Total Payable:</td><td>₹${grandTotal.toFixed(2)}</td></tr>
            </table>
          </div>

          <div style="margin-top:40px;border-top:1px solid #ccc;padding-top:12px;font-size:12px;color:#555;">
            <p><strong>Bank Details:</strong> ${BUSINESS_INFO.bankDetails.bankName} | A/C: ${BUSINESS_INFO.bankDetails.accountNumber} | IFSC: ${BUSINESS_INFO.bankDetails.ifscCode} | UPI: ${BUSINESS_INFO.bankDetails.upiId}</p>
            <p>Address: ${BUSINESS_INFO.warehouseAddress}</p>
          </div>

          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 text-slate-900">
      <div className="bg-white border-l border-slate-200 w-full max-w-xl h-full flex flex-col justify-between shadow-2xl relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <img
              src={LOGO_IMAGE}
              alt="VS Logo"
              className="w-8 h-8 rounded-lg border border-slate-300 object-cover shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Wholesale Cart Summary</h2>
              <span className="text-xs text-slate-500 font-mono">
                {totalQuantity.toLocaleString()} Total Units ({cartItems.length} Models)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors border border-slate-300 shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Your wholesale cart is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Browse our LED bulb catalog and select items meeting minimum order quantities.
              </p>
            </div>
          ) : (
            <>
              {/* Customer Info Input */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider font-mono block">
                  Optional Quotation Firm Info:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Your Shop / Firm Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="City / Location"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Itemized List */}
              <div className="space-y-2.5">
                {cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 items-center justify-between shadow-xs"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200 bg-white shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.product.modelCode} · MOQ: {item.product.moq} pcs
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-md px-1.5 py-0.5 text-xs">
                          <button
                            onClick={() =>
                              onUpdateQuantity(
                                item.product.id,
                                Math.max(item.product.moq, item.quantity - 50)
                              )
                            }
                            className="text-slate-600 hover:text-slate-900 font-bold px-1"
                          >
                            -
                          </button>
                          <span className="font-extrabold text-amber-700 font-mono">
                            {item.quantity} pcs
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 50)}
                            className="text-slate-600 hover:text-slate-900 font-bold px-1"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right font-mono">
                          <div className="text-xs font-extrabold text-slate-900">
                            ₹{item.totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            (@ ₹{item.calculatedUnitPrice.toFixed(2)}/pc)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions with 2 Distinct Order Options */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 text-xs font-mono shadow-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Items Subtotal:</span>
                <span className="text-slate-900 font-semibold">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>18% GST Invoice Tax:</span>
                <span>₹{gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Grand Total:</span>
                <span className="text-amber-700 text-base">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Main Prominent Option: Order Now to Admin */}
            <button
              onClick={() => {
                onClose();
                onOpenOrderNowModal();
              }}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>ORDER NOW (Direct to Admin)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Secondary Option: Order via WhatsApp */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleWhatsAppOrder}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 px-3 rounded-xl text-xs shadow transition-all flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Order via WhatsApp (93888 37310)</span>
              </button>

              <button
                onClick={handleDownloadQuotation}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 text-amber-700" />
                <span>Download Proforma</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-0.5">
              <button onClick={onClearCart} className="text-slate-500 hover:text-rose-600 font-semibold">
                Clear Cart
              </button>
              <span>VS Enterprises Official Invoice</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
