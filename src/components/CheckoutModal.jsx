import React, { useState } from 'react';
import { X, User, Phone, Home, Building2, MapPin, FileText, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cartItems, onOrderSuccess }) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    flatNo: '',
    societyName: '',
    address: 'Pune, Maharashtra',
    landmark: '',
    instructions: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!formData.flatNo.trim()) newErrors.flatNo = 'Flat / House Number is required';
    if (!formData.societyName.trim()) newErrors.societyName = 'Society / Building Name is required';
    if (!formData.address.trim()) newErrors.address = 'Locality / Area in Pune is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          customer: formData,
          totalAmount: totalAmount
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      onOrderSuccess(data);
    } catch (err) {
      console.error("Submission error:", err);
      setApiError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-8 animate-slide-up">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-farm-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-500/30">
                Guest Checkout
              </span>
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl mt-1">Delivery Details</h2>
            <p className="text-xs text-farm-200">No account required • Fast 30-second checkout</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-farm-300 hover:text-white rounded-full hover:bg-farm-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {apiError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
              ⚠️ {apiError}
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-farm-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-farm-600" />
              <span>Contact Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full pl-9 pr-3 py-2.5 bg-cream-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-farm-600 focus:ring-farm-100'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="e.g. 98765 43210"
                    maxLength={15}
                    className={`w-full pl-9 pr-3 py-2.5 bg-cream-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.mobileNumber ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-farm-600 focus:ring-farm-100'
                    }`}
                  />
                </div>
                {errors.mobileNumber && <p className="text-[11px] text-red-500 mt-1">{errors.mobileNumber}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-farm-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <MapPin className="w-4 h-4 text-farm-600" />
              <span>Pune Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Flat / House Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="flatNo"
                    value={formData.flatNo}
                    onChange={handleChange}
                    placeholder="e.g. B-402"
                    className={`w-full pl-9 pr-3 py-2.5 bg-cream-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.flatNo ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-farm-600 focus:ring-farm-100'
                    }`}
                  />
                </div>
                {errors.flatNo && <p className="text-[11px] text-red-500 mt-1">{errors.flatNo}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Society / Building Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="societyName"
                    value={formData.societyName}
                    onChange={handleChange}
                    placeholder="e.g. Green Acres Society"
                    className={`w-full pl-9 pr-3 py-2.5 bg-cream-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.societyName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-farm-600 focus:ring-farm-100'
                    }`}
                  />
                </div>
                {errors.societyName && <p className="text-[11px] text-red-500 mt-1">{errors.societyName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Locality / Area (Pune) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Baner / Kothrud / Wakad"
                  className={`w-full px-3 py-2.5 bg-cream-50/50 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.address ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:border-farm-600 focus:ring-farm-100'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Landmark <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="e.g. Near D-Mart / Metro Station"
                  className="w-full px-3 py-2.5 bg-cream-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-farm-600 focus:ring-2 focus:ring-farm-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Delivery Instructions <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  name="instructions"
                  rows={2}
                  value={formData.instructions}
                  onChange={handleChange}
                  placeholder="e.g. Leave with security guard if unavailable, call upon arrival..."
                  className="w-full pl-9 pr-3 py-2.5 bg-cream-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-farm-600 focus:ring-2 focus:ring-farm-100 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Final Order Summary Box */}
          <div className="bg-cream-100/70 border border-cream-300/60 rounded-2xl p-4 space-y-3">
            <h4 className="font-serif font-bold text-sm text-farm-950 flex items-center justify-between">
              <span>Order Summary ({cartItems.length} items)</span>
              <span className="text-farm-800 text-xs">Payment: Cash / UPI on Delivery</span>
            </h4>

            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 text-xs border-y border-cream-200 py-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-slate-700">
                  <span>{item.name} ({item.unit}) x {item.quantity}</span>
                  <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-extrabold text-farm-950 pt-1">
              <span>Total Payable Amount</span>
              <span className="text-lg text-emerald-800">₹{totalAmount}</span>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2 disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <span>Confirm Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
