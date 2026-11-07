import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, Package } from 'lucide-react';
import { BUSINESS_INFO } from '../data/products';

interface SampleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [shopName, setShopName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityState, setCityState] = useState('');
  const [selectedSample, setSelectedSample] = useState('9W Finished & Raw Assembly Sample Box');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const whatsappText = encodeURIComponent(
      `Hello VS Enterprises,\nI want to request a Wholesale Sample Kit:\n\n` +
      `🏪 Shop / Business: ${shopName}\n` +
      `👤 Contact Person: ${contactName}\n` +
      `📞 Phone: ${phone}\n` +
      `📍 City/State: ${cityState}\n` +
      `📦 Sample Kit Requested: ${selectedSample}\n\n` +
      `Please contact me for sample dispatch details.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${whatsappText}`, '_blank');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-950 border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Request Wholesale Sample Kit</h3>
            <p className="text-xs text-slate-400 font-mono">Test quality before placing bulk container orders</p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/50 border border-emerald-800/80 rounded-xl p-5 text-center space-y-2 py-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Sample Inquiry Sent!</h4>
            <p className="text-xs text-slate-300 font-mono">
              Redirecting to WhatsApp to complete your sample order with VS Enterprises.
            </p>
            <button
              onClick={onClose}
              className="mt-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-mono mb-1 font-semibold">
                Shop / Electrical Firm Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Laxmi Electricals & Hardware"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-mono mb-1 font-semibold">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-mono mb-1 font-semibold">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1 font-semibold">
                City & State *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kanpur, Uttar Pradesh"
                value={cityState}
                onChange={(e) => setCityState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-mono mb-1 font-semibold">
                Sample Box Type
              </label>
              <select
                value={selectedSample}
                onChange={(e) => setSelectedSample(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="9W Finished & Raw Assembly Sample Box">
                  9W Finished & Raw Assembly Sample Kit (5 Pcs)
                </option>
                <option value="12W AC/DC Inverter Bulb Sample">
                  12W AC/DC Emergency Inverter Bulb Sample
                </option>
                <option value="High Surge Driver & MCPCB Testing Pack">
                  High Surge 4kV Driver & MCPCB Testing Pack
                </option>
                <option value="15W COB & Panel Light Sample">
                  15W Architectural COB & Ceiling Panel Light Sample
                </option>
              </select>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sample cost will be adjusted against your first bulk order.</span>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Sample Request via WhatsApp</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
