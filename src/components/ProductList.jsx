import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, Info, AlertCircle, Leaf } from 'lucide-react';

export default function ProductList({ products, cartItems, onAddToCart, onUpdateQuantity }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fruits', 'Vegetables', 'Herbs'];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const getCartQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <section id="products-section" className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-farm-200/60 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-farm-700 uppercase tracking-widest mb-1">
            <Leaf className="w-4 h-4 text-farm-600" />
            <span>Weekly Fresh Harvest</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Available Produce for Next Week
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Handpicked quality fruits & vegetables available for doorstep Pune delivery.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-farm-800 text-white shadow-md shadow-farm-800/20'
                  : 'bg-white text-slate-600 hover:bg-farm-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const cartQty = getCartQuantity(product.id);
          const isOutOfStock = !product.inStock;

          return (
            <div
              key={product.id}
              className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 flex flex-col justify-between ${
                isOutOfStock 
                  ? 'opacity-75 grayscale-[25%]' 
                  : 'hover:shadow-xl hover:shadow-farm-900/5 hover:-translate-y-1'
              }`}
            >
              {/* Product Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3 z-10 bg-farm-900/90 backdrop-blur-md text-cream-100 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-farm-700/50 shadow">
                  {product.badge}
                </div>
              )}

              {/* Stock Status Tag */}
              {isOutOfStock && (
                <div className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow">
                  Out of Stock
                </div>
              )}

              <div>
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-cream-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-farm-800 transition-colors">
                      {product.name}
                    </h3>
                    {product.localName && (
                      <span className="text-xs font-medium text-farm-700 bg-farm-50 px-2 py-0.5 rounded border border-farm-100 shrink-0">
                        {product.localName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
                    {product.shortDescription}
                  </p>

                  <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-slate-100">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-farm-950">₹{product.price}</span>
                        <span className="text-xs text-slate-500 font-medium">/ {product.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Area */}
              <div className="p-4 pt-0">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>Currently Unavailable</span>
                  </button>
                ) : cartQty > 0 ? (
                  <div className="flex items-center justify-between bg-farm-50 p-1.5 rounded-xl border border-farm-200">
                    <button
                      onClick={() => onUpdateQuantity(product.id, cartQty - 1)}
                      className="w-9 h-9 rounded-lg bg-white text-farm-900 hover:bg-farm-100 flex items-center justify-center font-bold text-lg shadow-sm border border-farm-200 transition-colors active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="text-center px-2">
                      <span className="text-sm font-extrabold text-farm-950">{cartQty}</span>
                      <span className="text-[10px] text-farm-700 block font-medium">in cart</span>
                    </div>

                    <button
                      onClick={() => onUpdateQuantity(product.id, cartQty + 1)}
                      className="w-9 h-9 rounded-lg bg-farm-800 text-white hover:bg-farm-900 flex items-center justify-center font-bold text-lg shadow-sm transition-colors active:scale-95"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-3 px-4 bg-farm-800 hover:bg-farm-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 shadow-md shadow-farm-800/15 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShoppingCart className="w-4 h-4 text-farm-200" />
                    <span>Add to Basket</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
