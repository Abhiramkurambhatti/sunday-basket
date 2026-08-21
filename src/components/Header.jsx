import React from 'react';
import { ShoppingBag, PhoneCall, Instagram, ShieldCheck, Camera } from 'lucide-react';

export default function Header({ cartCount, onOpenCart, onOpenAdmin, onOpenGallery, isAdminView }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-farm-100 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-farm-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-center sm:text-left">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>🌿 Fresh Harvest Weekly • Delivery in Selected Pune Locations</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-farm-200">
            <button
              onClick={onOpenGallery}
              className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-emerald-300"
            >
              <Camera className="w-3.5 h-3.5" /> Farm Photos & Videos
            </button>
            <span className="text-farm-700">•</span>
            <a 
              href="https://wa.me/918087506237" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" /> 80875 06237
            </a>
            <span className="text-farm-700">•</span>
            <a 
              href="https://www.instagram.com/sundaybasket.pune" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3 h-3" /> @sundaybasket.pune
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Sunday Basket Logo" 
            className="w-12 h-12 rounded-full object-cover ring-2 ring-farm-300 shadow-md shadow-farm-900/10 hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-farm-950 tracking-tight leading-none">
                SUNDAY BASKET
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-farm-100 text-farm-800 rounded-full border border-farm-200">
                Pune
              </span>
            </div>
            <p className="text-xs text-farm-700 font-medium">Fresh • Seasonal • Trusted ❤️</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Farm Gallery Button */}
          <button
            onClick={onOpenGallery}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1.5 shadow-sm"
            title="View Farm Photos & Videos"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden xs:inline">Farm Gallery</span>
          </button>

          {/* Admin Toggle */}
          <button
            onClick={onOpenAdmin}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all flex items-center gap-1.5 ${
              isAdminView 
                ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm' 
                : 'bg-cream-100 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Seller Admin Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isAdminView ? 'Customer Mode' : 'Admin'}</span>
          </button>

          {/* Cart Icon Button */}
          {!isAdminView && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-farm-800 hover:bg-farm-900 text-white rounded-full transition-all shadow-md shadow-farm-800/20 active:scale-95 flex items-center gap-2 px-3.5"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-farm-100" />
              <span className="text-xs font-bold hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-emerald-400 text-farm-950 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-inner animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
