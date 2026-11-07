import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { X, Lock, CheckCircle2, AlertOctagon, Clock, Truck, ShieldAlert, Plus, Trash2, Edit, Package, Phone, MapPin, RefreshCw, MessageSquare } from 'lucide-react';

interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  phone: string;
  shopName?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  gstin?: string;
  items: Array<{ name: string; modelCode?: string; quantity: number; unitPrice: number; totalPrice: number }>;
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled';
  createdAt: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogProducts: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  catalogProducts,
  onUpdateProducts,
}) => {
  if (!isOpen) return null;

  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Add Product Form State
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCode, setNewProdCode] = useState('');
  const [newProdCat, setNewProdCat] = useState<'Finished LED Bulbs' | 'Raw Materials' | 'Inverter AC/DC Bulbs' | 'Drivers & MCPCBs' | 'COB & Panel Lights' | 'Flood & Street Lights'>('Finished LED Bulbs');
  const [newProdPrice, setNewProdPrice] = useState<number>(20);
  const [newProdMoq, setNewProdMoq] = useState<number>(100);
  const [newProdWatt, setNewProdWatt] = useState('9 Watt');
  const [newProdStock, setNewProdStock] = useState<number>(10000);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('/src/assets/images/product_9w_led_bulb_1794024027009.jpg');

  // Verify password
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'vishal123') {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Subscribe to real-time orders from Firestore
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const list: OrderRecord[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as OrderRecord);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(list);
        setLoadingOrders(false);
      },
      (error) => {
        console.error('Error listening to orders:', error);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated]);

  // Update order status in Firestore
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderRecord['status']) => {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, { status: newStatus });
    } catch (error) {
      handleFirestoreError(error, 'update', `orders/${orderId}`);
    }
  };

  // Add Product to catalog
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `custom-${Date.now()}`,
      name: newProdName || 'Custom LED Item',
      modelCode: newProdCode || `VSE-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProdCat,
      image: newProdImg,
      basePrice: Number(newProdPrice),
      moq: Number(newProdMoq),
      tiers: [
        { minQty: Number(newProdMoq), unitPrice: Number(newProdPrice) },
        { minQty: Number(newProdMoq) * 5, unitPrice: Number(newProdPrice) * 0.85 },
      ],
      specs: {
        wattage: newProdWatt,
        lumens: '100 lm/W',
        colorTemp: '6500K Cool Daylight',
        warranty: '1 Year Warranty',
        driverType: 'HPF Surge IC Driver',
        chipType: 'SMD LED Array',
        pcsPerBox: 100,
        housingMaterial: 'Heavy Duty Housing',
        operatingVoltage: '90V - 300V AC',
      },
      inStock: true,
      stockCount: Number(newProdStock),
      description: newProdDesc || 'High quality wholesale LED lighting model.',
    };

    onUpdateProducts([newProduct, ...catalogProducts]);
    setShowAddProduct(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  // Delete Product from catalog
  const handleDeleteProduct = (productId: string) => {
    onUpdateProducts(catalogProducts.filter((p) => p.id !== productId));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 text-slate-900">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative p-5 space-y-4 my-auto max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-900 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {!isAuthenticated ? (
          /* Password Authentication Gate */
          <div className="max-w-sm mx-auto py-8 text-center space-y-4 w-full">
            <div className="w-12 h-12 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">VS Enterprises Admin Panel</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">Enter Master Admin Security Password</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Enter password (vishal123)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full text-center bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 font-mono shadow-inner"
              />

              {passwordError && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg flex items-center justify-center gap-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Incorrect Admin Password! Try vishal123</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all shadow"
              >
                Unlock Admin Console
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <>
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 pr-8">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-extrabold text-slate-900">Admin Control Console</h3>
                <span className="text-xs text-slate-500">(Vishal Bhadauria)</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'orders'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Orders ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'products'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Products ({catalogProducts.length})
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {activeTab === 'orders' ? (
                /* Tab 1: All Customer Orders */
                <div className="space-y-3">
                  {loadingOrders ? (
                    <div className="py-12 text-center text-xs text-slate-500 font-mono">Loading real-time orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="py-12 text-center space-y-2">
                      <Package className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-700">No Wholesale Orders Yet</p>
                      <p className="text-[11px] text-slate-500">Orders submitted by buyers via "Order Now" will appear here automatically.</p>
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 font-mono text-sm">{ord.orderNumber}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {new Date(ord.createdAt).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-700 mt-0.5 flex items-center gap-2">
                              <span>Customer: <strong>{ord.userName}</strong> ({ord.userEmail})</span>
                              {ord.shopName && <span className="text-amber-700">· Shop: {ord.shopName}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/91${ord.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(ord.userName)},%20this%20is%20Vishal%20Bhadauria%20from%20VS%20Enterprises%20regarding%20your%20Order%20${ord.orderNumber}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp</span>
                            </a>
                            <span className="font-mono text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-1 rounded uppercase">
                              Status: {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* Customer Contact & Address Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Phone: <strong className="text-slate-900">{ord.phone}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate">Address: <strong className="text-slate-900">{ord.address}, {ord.city}, {ord.state}</strong></span>
                          </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="space-y-1 text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                          <div className="text-[10px] text-slate-500 uppercase font-bold border-b pb-1 mb-1">Ordered Items:</div>
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-slate-800">
                              <span>{it.name} × {it.quantity} pcs (@ ₹{it.unitPrice?.toFixed(2)}/pc)</span>
                              <strong className="text-slate-900">₹{it.totalPrice?.toFixed(2)}</strong>
                            </div>
                          ))}
                          <div className="border-t pt-1 font-bold flex justify-between text-slate-900 text-xs">
                            <span>Grand Total (incl 18% GST):</span>
                            <span className="text-amber-700 text-sm">₹{ord.grandTotal?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        {/* Admin Status Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                          <span className="text-[11px] text-slate-500 font-mono font-bold">Declare Order Status:</span>
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'pending')}
                              className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold"
                            >
                              Pending
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold"
                            >
                              Shipped
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                              className="px-2.5 py-1 rounded bg-green-700 hover:bg-green-600 text-white font-bold"
                            >
                              Delivered
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'canceled')}
                              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                /* Tab 2: Manage Products Catalog */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      Active Catalog Products ({catalogProducts.length})
                    </h4>
                    <button
                      onClick={() => setShowAddProduct((prev) => !prev)}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showAddProduct ? 'Cancel Form' : 'Add New Product'}</span>
                    </button>
                  </div>

                  {/* Add Product Form */}
                  {showAddProduct && (
                    <form onSubmit={handleAddProductSubmit} className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-3 text-xs">
                      <h5 className="font-extrabold text-slate-900 font-mono text-sm border-b pb-2">Add New LED Product to Wholesale Catalog</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-700 font-mono mb-1 font-bold">Product Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="VS 20W Heavy LED Bulb"
                            value={newProdName}
                            onChange={(e) => setNewProdName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-mono mb-1 font-bold">Model Code</label>
                          <input
                            type="text"
                            placeholder="VSE-20W-HV"
                            value={newProdCode}
                            onChange={(e) => setNewProdCode(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-slate-700 font-mono mb-1 font-bold">Category</label>
                          <select
                            value={newProdCat}
                            onChange={(e) => setNewProdCat(e.target.value as any)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900"
                          >
                            <option value="Finished LED Bulbs">Finished LED Bulbs</option>
                            <option value="Inverter AC/DC Bulbs">Inverter AC/DC Bulbs</option>
                            <option value="Raw Materials">Raw Materials</option>
                            <option value="Drivers & MCPCBs">Drivers & MCPCBs</option>
                            <option value="COB & Panel Lights">COB & Panel Lights</option>
                            <option value="Flood & Street Lights">Flood & Street Lights</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-700 font-mono mb-1 font-bold">Base Wholesale Price (₹)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newProdPrice}
                            onChange={(e) => setNewProdPrice(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-mono mb-1 font-bold">MOQ Quantity</label>
                          <input
                            type="number"
                            value={newProdMoq}
                            onChange={(e) => setNewProdMoq(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-4 py-2 rounded-lg text-xs"
                      >
                        Publish Product to Live Website
                      </button>
                    </form>
                  )}

                  {/* Product List Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catalogProducts.map((prod) => (
                      <div key={prod.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 items-center justify-between">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-300 bg-white shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 font-mono text-xs space-y-0.5">
                          <h5 className="font-extrabold text-slate-900 truncate">{prod.name}</h5>
                          <div className="text-slate-500 text-[11px]">{prod.category} · MOQ: {prod.moq} pcs</div>
                          <div className="text-amber-700 font-bold">Base Rate: ₹{prod.basePrice?.toFixed(2)} / pc</div>
                        </div>

                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-300 rounded-lg shadow-xs"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
