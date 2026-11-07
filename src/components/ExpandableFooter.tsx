import React, { useState } from 'react';
import { BUSINESS_INFO, LOGO_IMAGE } from '../data/products';
import { ChevronUp, ChevronDown, UserCheck, Building2, MapPin, Phone, Mail, ShieldCheck, CreditCard, Award, FileText } from 'lucide-react';

interface ExpandableFooterProps {
  onOpenSampleModal: () => void;
}

export const ExpandableFooter: React.FC<ExpandableFooterProps> = ({ onOpenSampleModal }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <footer className="bg-white/95 backdrop-blur border-t border-slate-200 text-slate-900 relative z-20 shadow-xl">
      {/* Sticky Expand / Collapse Bar */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer px-4 py-2.5 transition-colors shadow flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <img
            src={LOGO_IMAGE}
            alt="VS Enterprises"
            className="w-5 h-5 rounded border border-slate-700 object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
            VS ENTERPRISES — BUSINESS, OWNER & WHOLESALE CREDENTIALS
          </span>
          <span className="hidden md:inline-block bg-slate-800 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
            GSTIN: {BUSINESS_INFO.gstin}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300">
          <span>{isExpanded ? 'Collapse Details' : 'Scroll / Click for Owner & Business Credentials'}</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </div>
      </div>

      {/* Expanded Details Section */}
      <div className={`max-w-7xl mx-auto px-4 transition-all duration-300 overflow-hidden ${isExpanded ? 'py-6 opacity-100 max-h-[1500px]' : 'py-3 opacity-95 max-h-36 sm:max-h-24'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Column 1: Owner & Management Info */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-amber-700 font-bold font-mono uppercase">
              <UserCheck className="w-4 h-4" />
              <span>Owner & Management</span>
            </div>

            <div className="space-y-1 font-mono">
              <div className="text-sm font-extrabold text-slate-900">{BUSINESS_INFO.ownerName}</div>
              <div className="text-[11px] text-amber-700 font-bold">{BUSINESS_INFO.designation}</div>
              <p className="text-slate-600 text-[11px] leading-relaxed pt-0.5">
                Leading manufacturer & distributor of LED lighting systems established in {BUSINESS_INFO.establishedYear}. Over 12+ years of Indian lighting market trust.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 text-slate-800 space-y-1 font-mono">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <a href={`tel:${BUSINESS_INFO.phonePrimary.replace(/\s+/g, '')}`} className="hover:text-amber-700 font-semibold">
                  {BUSINESS_INFO.phonePrimary}
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-amber-700 truncate font-semibold">
                  {BUSINESS_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Business Registration & Tax Credentials */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-amber-700 font-bold font-mono uppercase">
              <Building2 className="w-4 h-4" />
              <span>Business Registration</span>
            </div>

            <div className="space-y-1.5 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Registered Firm Name</span>
                <span className="text-sm font-extrabold text-slate-900">{BUSINESS_INFO.companyName}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">GSTIN Registration</span>
                <span className="text-xs font-bold text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block mt-0.5">
                  {BUSINESS_INFO.gstin}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">MSME Udyam ID</span>
                <span className="text-xs text-slate-700">{BUSINESS_INFO.udyam}</span>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>100% Tax Compliant B2B Billing</span>
            </div>
          </div>

          {/* Column 3: Warehouse Address & Banking */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-amber-700 font-bold font-mono uppercase">
              <MapPin className="w-4 h-4" />
              <span>Warehouse & Banking</span>
            </div>

            <div className="space-y-1.5 font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">Factory & Depot Address</span>
                <p className="text-[11px] text-slate-700 leading-snug">
                  {BUSINESS_INFO.warehouseAddress}
                </p>
              </div>

              <div className="pt-1 border-t border-slate-200">
                <span className="text-[10px] text-slate-500 flex items-center gap-1 block">
                  <CreditCard className="w-3 h-3 text-amber-600" />
                  <span>NEFT / RTGS Bank Details</span>
                </span>
                <div className="text-[11px] text-slate-800 font-semibold">
                  {BUSINESS_INFO.bankDetails.bankName} · A/C: <strong className="text-slate-900">{BUSINESS_INFO.bankDetails.accountNumber}</strong>
                </div>
                <div className="text-[10px] text-slate-600">
                  IFSC: {BUSINESS_INFO.bankDetails.ifscCode} · UPI: {BUSINESS_INFO.bankDetails.upiId}
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Wholesale Terms & Warranty */}
          <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-amber-700 font-bold font-mono uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Wholesale Terms & Warranty</span>
            </div>

            <ul className="space-y-1 text-[11px] text-slate-700 font-mono">
              <li className="flex items-start gap-1">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>1-2 Year Replacement:</strong> Immediate credit note or replacement on defective driver units.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Sample Order Policy:</strong> Sample kits available for testing before container orders.</span>
              </li>
            </ul>

            <button
              onClick={onOpenSampleModal}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Request Wholesale Sample Box</span>
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="border-t border-slate-200 mt-4 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 font-mono">
          <div className="flex items-center gap-2">
            <img
              src={LOGO_IMAGE}
              alt="VS Logo"
              className="w-4 h-4 rounded border border-slate-300"
              referrerPolicy="no-referrer"
            />
            <span>© {new Date().getFullYear()} <strong>VS Enterprises</strong>. All Rights Reserved. Wholesale LED Depot.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>Delhi Wholesale Market</span>
            <span aria-hidden="true">·</span>
            <span>Direct Manufacturer Rates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
