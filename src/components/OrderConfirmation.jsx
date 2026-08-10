import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, ShoppingBag, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OrderConfirmation({ orderResponse, onNewOrder }) {
  const [copied, setCopied] = useState(false);

  if (!orderResponse || !orderResponse.order) return null;

  const { order, whatsAppUrl, formattedMessage } = orderResponse;

  const handleCopy = () => {
    if (formattedMessage) {
      navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      {/* Success Hero Box */}
      <div className="bg-gradient-to-b from-white to-cream-50 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 via-farm-600 to-emerald-400"></div>

        {/* Checkmark Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-widest rounded-full mb-2">
          Order Placed Successfully!
        </span>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
          Thank You, {order.customer.fullName}! ❤️
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
          Your order <span className="font-extrabold text-farm-900">#{order.id}</span> has been logged. We will prepare your fresh produce for doorstep delivery in Pune.
        </p>

        {/* Database Notification Tag */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-farm-900 text-cream-100 text-xs font-semibold rounded-full shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Seller Notified • Order Saved in System</span>
        </div>

        {/* Main WhatsApp Direct Action CTA */}
        <div className="mt-8 p-5 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-600/30 text-left space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                <MessageCircle className="w-5 h-5 fill-white text-emerald-700" />
                <span>Send Confirmation on WhatsApp</span>
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Click below to send a pre-filled order receipt directly to Sunday Basket (80875 06237).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-white text-emerald-900 hover:bg-cream-50 font-extrabold px-5 py-3 rounded-xl transition-all shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-98"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Open WhatsApp & Send Order</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-emerald-800/60 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl border border-emerald-400/30 transition-all flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Receipt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Receipt</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Detailed Receipt Card */}
        <div className="mt-8 text-left bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Order ID</span>
              <p className="font-extrabold text-slate-900 text-sm">#{order.id}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Order Date</span>
              <p className="text-xs font-semibold text-slate-700">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-farm-800">Delivery Address</span>
            <div className="mt-1 text-xs text-slate-700 bg-cream-50 p-3 rounded-xl border border-cream-200/80 leading-relaxed">
              <p className="font-bold text-slate-900">{order.customer.fullName} ({order.customer.mobileNumber})</p>
              <p>{order.customer.flatNo}, {order.customer.societyName}</p>
              <p>{order.customer.address}</p>
              {order.customer.landmark && <p className="text-slate-500">Landmark: {order.customer.landmark}</p>}
              {order.customer.instructions && (
                <p className="mt-1 text-farm-800 font-semibold bg-white p-2 rounded border border-farm-100">
                  📌 Instructions: {order.customer.instructions}
                </p>
              )}
            </div>
          </div>

          {/* Items Summary Table */}
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-farm-800">Ordered Items</span>
            <div className="mt-1 border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-2.5 flex justify-between items-center bg-white hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-farm-100 text-farm-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-800">{item.name} ({item.unit})</span>
                  </div>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-serif text-base font-bold text-slate-950">
            <span>Total Payable Amount</span>
            <span className="text-xl text-farm-900 font-extrabold">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Return to Home CTA */}
        <div className="mt-8">
          <button
            onClick={onNewOrder}
            className="px-6 py-2.5 bg-cream-200 hover:bg-cream-300 text-slate-800 font-bold text-xs rounded-full transition-all border border-cream-300 shadow-sm"
          >
            Place Another Order
          </button>
        </div>

      </div>
    </div>
  );
}
