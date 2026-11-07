import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ShieldCheck, Zap, Search, Lock, User, ShoppingBag, LogOut, LogIn } from 'lucide-react';
import { BUSINESS_INFO, LOGO_IMAGE } from '../data/products';
import { auth, signInWithGoogle, logoutUser } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSampleModal: () => void;
  onOpenAdminModal: () => void;
  onOpenUserOrdersModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenSampleModal,
  onOpenAdminModal,
  onOpenUserOrdersModal,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm text-slate-900">
      {/* Top Micro Announcement Bar */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-3 sm:px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold font-mono">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Direct Manufacturer Rates</span>
            </span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="hidden xs:inline">Owner: <strong className="text-white font-mono">Vishal Bhadauria</strong></span>
            <span aria-hidden="true" className="hidden md:inline text-slate-700">·</span>
            <span className="hidden md:inline flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Agra, UP Depot</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            <a
              href={`tel:${BUSINESS_INFO.phonePrimary.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 text-slate-200 hover:text-amber-400 transition-colors font-mono font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{BUSINESS_INFO.phonePrimary}</span>
            </a>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
              title="Admin Console (Password: vishal123)"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main White Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Zone with Generated VS Enterprises Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-900 group-hover:scale-105 transition-transform">
            <img
              src={LOGO_IMAGE}
              alt="VS Enterprises Official Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
              VS Enterprises
            </div>
            <span className="text-[10px] sm:text-[11px] text-amber-700 font-bold tracking-wider uppercase block font-mono">
              Wholesale LED Depot
            </span>
          </div>
        </a>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search wattage, model (e.g. 9W, AC/DC, Driver)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* User Account & WhatsApp Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenUserOrdersModal}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">My Orders</span>
              </button>
              <button
                onClick={logoutUser}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
              title="Sign in with Google"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <a
            href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hello%20VS%20Enterprises,%20I%20want%20to%20inquire%20about%20wholesale%20LED%20bulbs.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition-all shrink-0"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
};
