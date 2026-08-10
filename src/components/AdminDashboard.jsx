import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Package, ShoppingCart, DollarSign, 
  TrendingUp, RefreshCw, Edit, Trash2, Plus, Check, X, 
  Clock, Truck, CheckCircle2, XCircle, Search, Filter, MessageCircle, Settings, Bell
} from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'settings'

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Edit/Add Product Modal State
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Check stored auth
  useEffect(() => {
    const savedToken = localStorage.getItem('sunday_admin_key');
    if (savedToken) {
      setAdminKey(savedToken);
      fetchAdminData(savedToken);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: adminKey })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('sunday_admin_key', adminKey);
        setIsAuthenticated(true);
        fetchAdminData(adminKey);
      } else {
        setLoginError(data.error || 'Invalid Admin Security Key');
      }
    } catch (err) {
      setLoginError('Failed to connect to backend server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sunday_admin_key');
    setIsAuthenticated(false);
    setAdminKey('');
  };

  const fetchAdminData = async (token = adminKey) => {
    setIsLoading(true);
    try {
      const [ordersRes, prodsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/orders', { headers: { 'x-admin-key': token } }),
        fetch('/api/products'),
        fetch('/api/settings')
      ]);

      const ordersData = await ordersRes.json();
      const prodsData = await prodsRes.json();
      const settingsData = await settingsRes.json();

      if (ordersData.success) setOrders(ordersData.orders);
      if (prodsData.success) setProducts(prodsData.products);
      if (settingsData.success) setSettings(settingsData.settings);

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleToggleProductStock = async (product) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ inStock: !product.inStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === product.id ? data.product : p));
      }
    } catch (err) {
      alert("Failed to update product stock");
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productPayload = {
      name: formData.get('name'),
      localName: formData.get('localName'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      unit: formData.get('unit'),
      shortDescription: formData.get('shortDescription'),
      image: formData.get('image') || '/uploads/pomegranate.jpg',
      badge: formData.get('badge')
    };

    try {
      const isEdit = Boolean(editingProduct?.id);
      const url = isEdit ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(productPayload)
      });
      const data = await res.json();

      if (data.success) {
        setIsProductModalOpen(false);
        setEditingProduct(null);
        fetchAdminData();
      } else {
        alert("Error saving product: " + data.error);
      }
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.mobileNumber.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingCount = orders.filter(o => ['New', 'Confirmed', 'Out for Delivery'].includes(o.status)).length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl shadow-xl border border-slate-200 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-farm-900 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-slate-900">Seller Admin Panel</h2>
          <p className="text-xs text-slate-500">Enter security key to manage products & orders</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          {loginError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200 text-center">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Security Key</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Default: admin123"
              className="w-full px-4 py-3 bg-cream-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-farm-700 focus:ring-2 focus:ring-farm-100"
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-farm-900 hover:bg-farm-950 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98"
          >
            {isLoggingIn ? 'Authenticating...' : 'Unlock Admin Dashboard'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Return to Storefront
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Top Admin Header */}
      <div className="bg-farm-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-farm-200">Seller Dashboard</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-cream-50">Sunday Basket Store Admin</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAdminData()}
            className="p-2.5 bg-farm-800 hover:bg-farm-700 rounded-xl text-farm-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-red-600/80 hover:bg-red-600 rounded-xl text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl">
            ₹
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Total Sales Revenue</p>
            <h3 className="text-2xl font-extrabold text-slate-900">₹{totalRevenue}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Total Orders Logged</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{orders.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Pending Deliveries</p>
            <h3 className="text-2xl font-extrabold text-amber-700">{pendingCount}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'border-b-2 border-farm-800 text-farm-950'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'products'
              ? 'border-b-2 border-farm-800 text-farm-950'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Produce Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === 'settings'
              ? 'border-b-2 border-farm-800 text-farm-950'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Notification Settings</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search order ID, name, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-farm-700"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {['All', 'New', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    statusFilter === status 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List Table / Cards */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                No orders match your current filter.
              </div>
            ) : (
              filteredOrders.map(order => {
                const statusColors = {
                  'New': 'bg-blue-100 text-blue-800 border-blue-200',
                  'Confirmed': 'bg-purple-100 text-purple-800 border-purple-200',
                  'Out for Delivery': 'bg-amber-100 text-amber-900 border-amber-200',
                  'Delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  'Cancelled': 'bg-red-100 text-red-800 border-red-200'
                };

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-base text-slate-900">#{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[order.status] || 'bg-slate-100'}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 bg-cream-50 border border-slate-300 rounded-lg text-xs font-bold focus:outline-none"
                        >
                          <option value="New">New</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Customer Details */}
                      <div className="bg-cream-50/70 p-3 rounded-xl border border-cream-200 space-y-1">
                        <p className="font-bold text-slate-900">{order.customer.fullName} • 📱 {order.customer.mobileNumber}</p>
                        <p className="text-slate-600">{order.customer.flatNo}, {order.customer.societyName}</p>
                        <p className="text-slate-600">{order.customer.address}</p>
                        {order.customer.landmark && <p className="text-slate-500">Landmark: {order.customer.landmark}</p>}
                        {order.customer.instructions && (
                          <p className="text-amber-800 font-semibold mt-1">📌 {order.customer.instructions}</p>
                        )}
                        <div className="pt-2 flex gap-2">
                          <a
                            href={`https://wa.me/91${order.customer.mobileNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${order.customer.fullName}, regarding your Sunday Basket Order #${order.id}: Status is now ${order.status}.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Customer</span>
                          </a>
                        </div>
                      </div>

                      {/* Items & Total */}
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800">Ordered Items:</p>
                        <ul className="space-y-1 divide-y divide-slate-100">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between py-1 text-slate-700">
                              <span>{item.name} ({item.unit}) x {item.quantity}</span>
                              <span className="font-bold">₹{item.price * item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 flex justify-between font-bold text-sm text-slate-950 border-t border-slate-200">
                          <span>Total Amount</span>
                          <span className="text-emerald-700">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg text-slate-900">Manage Farm Produce</h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map(prod => (
              <div key={prod.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative aspect-video bg-slate-100">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleToggleProductStock(prod)}
                    className={`absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase shadow transition-transform active:scale-95 ${
                      prod.inStock ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {prod.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>
                </div>

                <div className="p-4 space-y-2 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-serif font-bold text-base text-slate-900">{prod.name}</h4>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      ₹{prod.price}/{prod.unit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{prod.shortDescription}</p>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsProductModalOpen(true);
                    }}
                    className="p-2 text-slate-600 hover:text-farm-900 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATION SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 max-w-xl">
          <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-farm-700" />
            <span>Order Notification Channels</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-900 text-sm">✅ Active Notification Channels</h4>
              <p className="text-emerald-800">
                1. <strong>Direct WhatsApp Redirection:</strong> Customer receives pre-filled WhatsApp link to message target <strong>80875 06237</strong>.<br/>
                2. <strong>Admin Dashboard Real-time Feed:</strong> All order payloads automatically save into SQLite/JSON DB for instant view.<br/>
                3. <strong>Console Audit Dispatcher:</strong> Formatted receipt logged to backend server stdout.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Seller WhatsApp Number</label>
              <input
                type="text"
                defaultValue={settings?.sellerPhone || "8087506237"}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                disabled
              />
              <p className="text-[11px] text-slate-500 mt-1">Configured in backend environment / database settings.</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit/Add Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg">
                {editingProduct ? 'Edit Produce Item' : 'Add New Produce Item'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Product Name *</label>
                <input
                  name="name"
                  defaultValue={editingProduct?.name || ''}
                  required
                  placeholder="e.g. Fresh Custard Apple"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Local Name</label>
                  <input
                    name="localName"
                    defaultValue={editingProduct?.localName || ''}
                    placeholder="e.g. Sitaphal"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select name="category" defaultValue={editingProduct?.category || 'Fruits'} className="w-full p-2.5 border rounded-xl">
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Herbs">Herbs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    defaultValue={editingProduct?.price || 100}
                    required
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Unit *</label>
                  <input
                    name="unit"
                    defaultValue={editingProduct?.unit || '1 kg'}
                    required
                    placeholder="e.g. 1 kg / 4 pcs"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL</label>
                <input
                  name="image"
                  defaultValue={editingProduct?.image || '/uploads/pomegranate.jpg'}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description</label>
                <textarea
                  name="shortDescription"
                  rows={2}
                  defaultValue={editingProduct?.shortDescription || ''}
                  className="w-full p-2.5 border rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Badge (Optional)</label>
                <input
                  name="badge"
                  defaultValue={editingProduct?.badge || ''}
                  placeholder="e.g. Bestseller / Farm Fresh"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
