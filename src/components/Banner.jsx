import React from 'react';
import { Calendar, MessageCircle, ArrowRight, Sparkles, CheckCircle2, Camera } from 'lucide-react';

export default function Banner({ onBrowseClick, onOpenGallery }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-farm-900 via-farm-800 to-farm-950 text-white py-8 sm:py-12 px-4 shadow-xl">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Heading & Value Proposition */}
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AVAILABLE NEXT WEEK • FRESH HARVEST</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight text-cream-50">
            Fresh Farm Produce <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-yellow-200 to-emerald-400">
              Directly to Your Home
            </span>
          </h2>

          <p className="text-sm sm:text-base text-farm-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            Grown with care, handpicked at peak freshness, and delivered right to your doorstep across selected societies in Pune.
          </p>

          {/* Quick Value Badges */}
          <div className="grid grid-cols-3 gap-2 py-2 max-w-md mx-auto lg:mx-0 text-center">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm">
              <span className="text-lg">🌿</span>
              <p className="text-xs font-bold text-cream-100 mt-1">100% Farm Fresh</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm">
              <span className="text-lg">❤️</span>
              <p className="text-xs font-bold text-cream-100 mt-1">Carefully Selected</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-sm">
              <span className="text-lg">📍</span>
              <p className="text-xs font-bold text-cream-100 mt-1">Pune Delivery</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onBrowseClick}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-farm-950 font-extrabold px-6 py-3 rounded-full transition-all duration-200 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <span>Order Fresh Produce Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGallery}
              className="w-full sm:w-auto bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 font-semibold px-5 py-3 rounded-full border border-emerald-500/30 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>View Farm Photos & Videos</span>
            </button>

            <a
              href="https://chat.whatsapp.com/Ju1bQGnndEB0ihvkcKqYXM"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-full border border-white/20 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Group</span>
            </a>
          </div>
        </div>

        {/* Right Column: Next Week Schedule Notice Box */}
        <div className="lg:col-span-5">
          <div className="bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl relative">
            <div className="absolute -top-3 right-4 bg-emerald-400 text-farm-950 text-[11px] font-black uppercase px-3 py-1 rounded-full shadow">
              Order Window Open
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-cream-50">Next Week Delivery Schedule</h3>
                <p className="text-xs text-farm-200">Orders close Wednesday 10 PM</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-farm-100/90 border-t border-white/10 pt-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Select your fresh fruits & vegetables from the weekly list.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant Guest Checkout — no password or account needed.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Receive order confirmation directly on WhatsApp & phone.</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-farm-200">
              <span>Delivery Partner: Sunday Basket Express</span>
              <span className="font-bold text-emerald-300">Pune Societies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
