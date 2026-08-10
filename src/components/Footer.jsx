import React from 'react';
import { Leaf, PhoneCall, Instagram, MapPin, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
  const locations = [
    "Kothrud", "Baner", "Aundh", "Wakad", "Hinjawadi", 
    "Viman Nagar", "Kharadi", "Hadapsar", "Pimple Saudagar", "Magarpatta"
  ];

  return (
    <footer className="bg-farm-950 text-cream-100 border-t border-farm-800 pt-12 pb-24 sm:pb-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-farm-800/80">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Sunday Basket Logo" 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50 shadow-md"
            />
            <div>
              <h3 className="text-xl font-serif font-bold text-cream-50">SUNDAY BASKET</h3>
              <p className="text-xs text-farm-300">Fresh • Seasonal • Trusted ❤️</p>
            </div>
          </div>

          <p className="text-xs text-farm-200/80 leading-relaxed max-w-sm">
            Bringing premium, handpicked, fresh farm produce directly to your doorstep in Pune. Support local agriculture and enjoy seasonal sweetness in every bite.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://wa.me/918087506237"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-farm-900 hover:bg-farm-800 text-emerald-400 rounded-xl transition-colors border border-farm-800 flex items-center gap-2 text-xs font-semibold"
            >
              <PhoneCall className="w-4 h-4" />
              <span>80875 06237</span>
            </a>

            <a
              href="https://www.instagram.com/sundaybasket.pune"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 bg-farm-900 hover:bg-farm-800 text-pink-400 rounded-xl transition-colors border border-farm-800 flex items-center gap-2 text-xs font-semibold"
            >
              <Instagram className="w-4 h-4" />
              <span>@sundaybasket.pune</span>
            </a>
          </div>
        </div>

        {/* Delivery Locations */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-serif font-bold text-sm text-cream-50 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Selected Delivery Areas in Pune</span>
          </h4>
          
          <div className="flex flex-wrap gap-1.5 pt-1">
            {locations.map((loc) => (
              <span 
                key={loc}
                className="px-2.5 py-1 bg-farm-900/60 border border-farm-800/80 rounded-lg text-[11px] text-farm-200"
              >
                {loc}
              </span>
            ))}
          </div>
        </div>

        {/* WhatsApp Group Box */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-serif font-bold text-sm text-cream-50 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Weekly Fresh List</span>
          </h4>
          <p className="text-xs text-farm-200/80">
            Join our WhatsApp group to receive weekly harvest stock updates and special discounts.
          </p>

          <a
            href="https://chat.whatsapp.com/Ju1bQGnndEB0ihvkcKqYXM"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-farm-950 font-bold text-xs rounded-xl transition-all justify-center items-center gap-2 shadow-md shadow-emerald-500/20"
          >
            <span>Join WhatsApp Group</span>
          </a>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-farm-400 gap-2">
        <p>© {new Date().getFullYear()} Sunday Basket Pune. Fresh • Seasonal • Carefully Selected.</p>
        <p className="flex items-center gap-1">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          <span>for Pune Families</span>
        </p>
      </div>
    </footer>
  );
}
