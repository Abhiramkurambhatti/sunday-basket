import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedCheckout }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-up sm:animate-none">
          
          {/* Cart Header */}
          <div className="p-4 sm:p-6 bg-farm-900 text-white flex items-center justify-between border-b border-farm-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-farm-800 rounded-lg text-emerald-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg leading-tight">Your Farm Produce Basket</h2>
                <p className="text-xs text-farm-200">{totalItemsCount} item{totalItemsCount !== 1 ? 's' : ''} selected</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-farm-300 hover:text-white rounded-full hover:bg-farm-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body: Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-farm-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-farm-100">
                  <ShoppingBag className="w-10 h-10 text-farm-400" />
                </div>
                <h3 className="font-serif font-bold text-lg text-slate-800">Your basket is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explore our weekly harvest list of fresh pomegranates, sitaphal, onions & herbs to add items.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 bg-farm-800 hover:bg-farm-900 text-white font-bold text-xs rounded-full transition-all shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-4 p-3 bg-cream-50/70 border border-slate-200/80 rounded-2xl items-center shadow-sm"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0 bg-white"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-sm text-slate-900 truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      ₹{item.price} / {item.unit}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="text-slate-600 hover:text-farm-900 font-bold px-1 text-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 px-1">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="text-slate-600 hover:text-farm-900 font-bold px-1 text-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-sm text-farm-950">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-white border-t border-slate-200 space-y-4 shadow-lg">
              {/* Delivery info tag */}
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs border border-emerald-200">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Selected Pune Locations • Direct Farm Delivery</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-farm-950">₹{totalAmount}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
