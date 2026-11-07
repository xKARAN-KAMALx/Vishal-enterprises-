import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { X, Package, Clock, CheckCircle2, Truck, AlertOctagon, User } from 'lucide-react';

interface OrderRecord {
  id: string;
  orderNumber: string;
  items: Array<{ name: string; quantity: number; unitPrice: number; totalPrice: number }>;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled';
  createdAt: string;
  phone: string;
  city: string;
}

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: OrderRecord[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as OrderRecord);
        });
        // Sort newest first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading user orders:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>CONFIRMED</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
            <Truck className="w-3 h-3 text-blue-600" />
            <span>SHIPPED</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-green-100 text-green-900 border border-green-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-700" />
            <span>DELIVERED</span>
          </span>
        );
      case 'canceled':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-rose-600" />
            <span>CANCELED</span>
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-700" />
            <span>PENDING APPROVAL</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 text-slate-900">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl relative p-5 space-y-4 my-auto">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-900 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-xl flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">My Wholesale Orders</h3>
            <p className="text-xs text-slate-500 font-mono">Signed in as: <strong className="text-slate-800">{user?.displayName || user?.email}</strong></p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500 font-mono">Loading your orders...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">No Orders Found</p>
              <p className="text-[11px] text-slate-500">You haven't placed any wholesale orders yet.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900">{ord.orderNumber}</span>
                    <span className="text-[10px] text-slate-500 ml-2">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {getStatusBadge(ord.status)}
                </div>

                <div className="space-y-1 text-xs border-t border-slate-200 pt-2 font-mono">
                  {ord.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700">
                      <span>{it.name} ({it.quantity} pcs)</span>
                      <strong className="text-slate-900">₹{it.totalPrice?.toFixed(2)}</strong>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-baseline border-t border-slate-200 pt-2 text-xs font-mono">
                  <span className="text-slate-500">Location: {ord.city}</span>
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px]">Grand Total: </span>
                    <strong className="text-amber-700 text-sm">₹{ord.grandTotal?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
