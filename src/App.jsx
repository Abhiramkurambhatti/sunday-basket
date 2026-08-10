import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmation from './components/OrderConfirmation';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { ShoppingBag, ArrowRight, PhoneCall, Sparkles } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  
  const [isAdminView, setIsAdminView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial product catalog from server
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems(prev =>
        prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
      );
    }
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleOrderSuccess = (data) => {
    setOrderSuccessData(data);
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    // Scroll to top for order confirmation view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetOrder = () => {
    setOrderSuccessData(null);
    fetchProducts();
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream-50 text-slate-800">
      
      {/* Top Header Navigation */}
      <Header 
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminView(!isAdminView)}
        isAdminView={isAdminView}
      />

      {/* Main Body View Switching */}
      <main className={`flex-1 ${!isAdminView && !orderSuccessData && totalCartCount > 0 ? 'pb-24 sm:pb-0' : ''}`}>
        {isAdminView ? (
          <AdminDashboard onClose={() => setIsAdminView(false)} />
        ) : orderSuccessData ? (
          <OrderConfirmation 
            orderResponse={orderSuccessData}
            onNewOrder={handleResetOrder}
          />
        ) : (
          <>
            <Banner onBrowseClick={scrollToProducts} />
            
            {isLoading ? (
              <div className="text-center py-20">
                <div className="w-10 h-10 border-4 border-farm-800 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-500 font-semibold">Fetching fresh produce list...</p>
              </div>
            ) : (
              <ProductList 
                products={products}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {!isAdminView && <Footer />}

      {/* Slide-over Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Guest Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Floating Sticky Mobile Cart Bar */}
      {!isAdminView && !orderSuccessData && totalCartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl animate-slide-up sm:hidden">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div>
              <span className="text-[10px] uppercase font-bold text-farm-800 tracking-wider block">
                {totalCartCount} item{totalCartCount > 1 ? 's' : ''} in basket
              </span>
              <span className="text-lg font-extrabold text-slate-900">₹{totalCartAmount}</span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-full transition-all shadow-md shadow-emerald-600/30 flex items-center gap-2 active:scale-95"
            >
              <span>View Cart & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
