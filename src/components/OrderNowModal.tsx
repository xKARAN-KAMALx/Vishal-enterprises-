import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { auth, signInWithGoogle } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';
import { X, CheckCircle2, ShieldCheck, Phone, MapPin, Building, LogIn, ShoppingBag, ArrowRight } from 'lucide-react';
import { User } from 'firebase/auth';

interface OrderNowModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: () => void;
}

export const OrderNowModal: React.FC<OrderNowModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderCompletedId, setOrderCompletedId] = useState<string | null>(null);

  // Form Fields
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('');
  const [gstin, setGstin] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const gstAmount = subtotal * 0.18;
  const grandTotal = subtotal + gstAmount;

  const handleGoogleAuth = async () => {
    try {
      setIsSigningIn(true);
      const user = await signInWithGoogle();
      setCurrentUser(user);
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!phone.trim() || !address.trim() || !city.trim()) return;

    try {
      setIsSubmitting(true);
      const orderNumber = `VSE-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData = {
        orderNumber,
        userId: currentUser.uid,
        userEmail: currentUser.email || 'n/a',
        userName: currentUser.displayName || 'Wholesale Buyer',
        phone,
        shopName,
        address,
        city,
        state,
        pincode,
        gstin,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          modelCode: item.product.modelCode,
          quantity: item.quantity,
          unitPrice: item.calculatedUnitPrice,
          totalPrice: item.totalPrice,
        })),
        subtotal,
        gstAmount,
        grandTotal,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderCompletedId(orderNumber);
      onOrderSuccess();
    } catch (error) {
      handleFirestoreError(error, 'create', 'orders');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 text-slate-900">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative p-5 space-y-4 my-auto">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-900 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {orderCompletedId ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">Order Placed Successfully!</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono max-w-xs mx-auto">
              <div>Order Number: <strong className="text-amber-700">{orderCompletedId}</strong></div>
              <div className="text-slate-500 mt-1">Status: <strong className="text-amber-600 uppercase font-bold">Pending Approval</strong></div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Our Managing Owner <strong>Vishal Bhadauria (93888 37310)</strong> has received your wholesale order in the admin console. You will receive dispatch updates soon!
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
            >
              Done & Close
            </button>
          </div>
        ) : !currentUser ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Google Authentication Required</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto mt-1">
                Please sign in with Google to place your wholesale order. Your account will save all past orders and track live dispatch statuses!
              </p>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={isSigningIn}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-slate-700"
            >
              <LogIn className="w-4 h-4 text-amber-400" />
              <span>{isSigningIn ? 'Connecting Google Account...' : 'Sign in with Google to Place Order'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="space-y-3.5">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Complete Wholesale Order</h3>
                <p className="text-xs text-slate-500 font-mono">Signed in as: <strong className="text-slate-900">{currentUser.displayName || currentUser.email}</strong></p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-300">
                Total: ₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mobile Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">
                    Shop / Firm Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Electricals"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">
                    GSTIN (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-mono mb-1 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Delivery Address *</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street / Shop Number, Wholesale Market area..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="Agra"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="Uttar Pradesh"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-mono mb-1 font-bold">Pincode</label>
                  <input
                    type="text"
                    placeholder="282001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] text-slate-700 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Order will be sent directly to Admin (Vishal Bhadauria - 93888 37310).</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Order to Admin...' : 'Confirm & Send Order to Admin'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
