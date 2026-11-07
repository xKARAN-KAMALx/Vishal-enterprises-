import React from 'react';
import { MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data/products';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hello%20VS%20Enterprises,%20I%20want%20to%20contact%20you%20regarding%20wholesale%20LED%20bulbs.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 sm:right-6 z-40 bg-emerald-500 hover:bg-emerald-400 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
      title="Contact VS Enterprises on WhatsApp (93888 37310)"
    >
      <MessageSquare className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-extrabold text-xs pl-0 group-hover:pl-2">
        Chat with Vishal Bhadauria (93888 37310)
      </span>
    </a>
  );
};
