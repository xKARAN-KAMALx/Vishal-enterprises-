import React from 'react';
import { HERO_BANNER_IMAGE, LOGO_IMAGE } from '../data/products';
import { Zap, PackageCheck, Truck, Percent } from 'lucide-react';

interface CompactHeroProps {
  onOpenSampleModal: () => void;
}

export const CompactHero: React.FC<CompactHeroProps> = ({ onOpenSampleModal }) => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 py-4 md:py-5">
      <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xl text-slate-900 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center gap-2">
              <img
                src={LOGO_IMAGE}
                alt="VS Logo"
                className="w-6 h-6 rounded border border-slate-300 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-mono font-bold text-amber-700 tracking-wider uppercase">
                VS ENTERPRISES B2B WHOLESALE DEPOT
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Factory Direct Wholesale LED Bulbs & Assembly Components
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Tiered bulk pricing with MOQ flexibility. Premium 4kV surge IC drivers, EPISTAR chips, raw housing bodies, and emergency AC/DC bulbs for retailers & electrical distributors across India.
            </p>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2 shadow-xs">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">90-300V AC</div>
                  <div className="text-[10px] text-slate-500">Surge Proof</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2 shadow-xs">
                <Percent className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Up to 35% Off</div>
                  <div className="text-[10px] text-slate-500">Bulk Tiers</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2 shadow-xs">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">24-48 hr</div>
                  <div className="text-[10px] text-slate-500">India Dispatch</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center gap-2 shadow-xs">
                <PackageCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Tested</div>
                  <div className="text-[10px] text-slate-500">Warranty Backed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Banner Image */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-lg max-h-48 lg:max-h-52 bg-slate-900">
              <img
                src={HERO_BANNER_IMAGE}
                alt="VS Enterprises Factory Showroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-semibold text-[11px]">Daily Capacity: 50,000+ Units</span>
                <button
                  onClick={onOpenSampleModal}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1 rounded text-[11px] shadow transition-colors"
                >
                  Request Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
