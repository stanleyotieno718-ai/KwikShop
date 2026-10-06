import React, { useState } from 'react';
import { Store, StoreItem, StoreOrder } from '../types/store';
import { 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Phone, 
  Check, 
  Plus, 
  Minus, 
  X, 
  Send, 
  Sparkles, 
  Star, 
  ArrowLeft,
  Share2,
  CheckCircle2,
  Truck,
  CreditCard
} from 'lucide-react';
import { createWhatsAppOrderLink, createWhatsAppShareLink } from '../utils/whatsapp';

interface CustomerStorefrontProps {
  store: Store;
  onPlaceOrder: (order: StoreOrder) => void;
  onBackToDirectory?: () => void;
  onOpenOwnerDashboard?: () => void;
}

interface CartItem {
  item: StoreItem;
  quantity: number;
}

export const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({
  store,
  onPlaceOrder,
  onBackToDirectory,
  onOpenOwnerDashboard
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mobile_money' | 'cash_on_delivery' | 'card'>('mobile_money');
  const [notes, setNotes] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<StoreOrder | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Extract distinct categories
  const categories = ['All', ...Array.from(new Set(store.items.map(i => i.category)))];

  const filteredItems = selectedCategory === 'All'
    ? store.items
    : store.items.filter(i => i.category === selectedCategory);

  // Cart operations
  const addToCart = (item: StoreItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const totalItemCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const cartSubtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? store.deliveryFee : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  const handleCheckout = (viaWhatsApp: boolean) => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please provide your name and phone number so the merchant can contact you.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please enter your delivery address or building landmark.');
      return;
    }

    const newOrder: StoreOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      storeId: store.id,
      customerName,
      customerPhone,
      items: cart.map(ci => ({
        itemId: ci.item.id,
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price
      })),
      total: grandTotal,
      status: 'new',
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      paymentMethod,
      paymentStatus: paymentMethod === 'mobile_money' ? 'paid' : 'pending',
      notes,
      createdAt: 'Just now'
    };

    onPlaceOrder(newOrder);

    if (viaWhatsApp) {
      const waUrl = createWhatsAppOrderLink(
        store,
        customerName,
        customerPhone,
        cart.map(ci => ({ name: ci.item.name, quantity: ci.quantity, price: ci.item.price })),
        orderType,
        deliveryAddress,
        paymentMethod,
        notes
      );
      window.open(waUrl, '_blank');
    }

    setConfirmedOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareToWhatsApp = () => {
    const url = window.location.href;
    const shareUrl = createWhatsAppShareLink(store, url);
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-28">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBackToDirectory && (
              <button
                onClick={onBackToDirectory}
                className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                title="Back to Directory"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="font-bold text-stone-900 text-sm tracking-tight truncate max-w-[180px] sm:max-w-xs">
              {store.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareToWhatsApp}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
            </button>
            {onOpenOwnerDashboard && (
              <button
                onClick={onOpenOwnerDashboard}
                className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Store Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-2">
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          {/* Banner Photo */}
          <div className="relative h-44 sm:h-56 w-full bg-stone-200 overflow-hidden">
            {store.bannerImage ? (
              <img
                src={store.bannerImage}
                alt={store.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-emerald-800 to-stone-900 flex items-center justify-center text-white">
                <span className="font-bold text-2xl">{store.name}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Badges on hero image */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm inline-block mb-1.5">
                  Verified Local Merchant
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                  {store.name}
                </h1>
                <p className="text-xs text-stone-200 line-clamp-1">{store.tagline}</p>
              </div>

              <div className="hidden sm:flex flex-col items-end text-white text-xs">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{store.rating.toFixed(1)}</span>
                  <span className="text-stone-300">({store.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details Ribbon */}
          <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 border-t border-stone-100">
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold text-stone-800">{store.town}</span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500 truncate max-w-[200px]">{store.address}</span>
              </span>

              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{store.hours}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${store.name}, I have a question about your menu.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 border border-stone-200 text-stone-700 hover:bg-stone-50 rounded-lg flex items-center gap-1 transition-colors"
                title="Copy Store Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-4 sticky top-12 z-20 bg-stone-50/90 backdrop-blur-sm pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Item Catalog Grid */}
      <div className="max-w-4xl mx-auto px-4 pt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const inCart = cart.find(ci => ci.item.id === item.id);

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 transition-all flex flex-col justify-between"
              >
                {item.image && (
                  <div className="h-36 w-full bg-stone-100 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {item.estimatedTime || '15 mins'}
                    </div>
                  </div>
                )}

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-0.5 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold font-mono text-stone-900">
                        {store.currencySymbol} {item.price.toLocaleString()}
                      </p>
                      {item.unit && (
                        <p className="text-[10px] text-stone-400 font-normal">
                          {item.unit}
                        </p>
                      )}
                    </div>

                    {inCart ? (
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-stone-700 hover:bg-stone-200 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">
                          {inCart.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 inset-x-4 max-w-xl mx-auto z-40">
          <div className="bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-stone-700/60 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                {totalItemCount}
              </div>
              <div>
                <p className="text-xs text-stone-300">Your Order Subtotal</p>
                <p className="text-sm font-bold font-mono">
                  {store.currencySymbol} {cartSubtotal.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View Cart & Checkout</span>
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-stone-900">Your Order</h2>
                <span className="text-xs text-stone-400">({totalItemCount} items)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 divide-y divide-stone-100 flex-1">
              {cart.map(ci => (
                <div key={ci.item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{ci.item.name}</p>
                    <p className="text-[11px] text-stone-400 font-mono">
                      {store.currencySymbol} {ci.item.price.toLocaleString()} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-stone-100 rounded-md p-0.5">
                      <button
                        onClick={() => updateQuantity(ci.item.id, -1)}
                        className="w-5 h-5 flex items-center justify-center bg-white rounded text-stone-700"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-mono font-bold px-1">{ci.quantity}</span>
                      <button
                        onClick={() => updateQuantity(ci.item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center bg-white rounded text-stone-700"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <p className="text-xs font-bold font-mono w-16 text-right">
                      {store.currencySymbol} {(ci.item.price * ci.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Delivery vs Pickup Toggle */}
              <div className="pt-4 mt-2">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrderType('delivery')}
                    className={`p-2.5 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                      orderType === 'delivery'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Doorstep Delivery</span>
                  </button>
                  <button
                    onClick={() => setOrderType('pickup')}
                    className={`p-2.5 text-xs font-semibold rounded-lg border flex items-center justify-center gap-2 transition-all ${
                      orderType === 'pickup'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Store Pickup</span>
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="pt-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Kiprono Cheruiyot"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="e.g. 0721 990 011"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Delivery Address & Landmark *</label>
                    <input
                      type="text"
                      placeholder="e.g. United Mall, 1st Floor, Shop 12"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Special Notes / Dietary preference</label>
                  <input
                    type="text"
                    placeholder="e.g. Extra kachumbari, please call upon arrival"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4">
                <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {store.acceptsMobileMoney && (
                    <label className="flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer bg-stone-50/60 hover:bg-stone-50">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'mobile_money'}
                        onChange={() => setPaymentMethod('mobile_money')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-stone-900">Mobile Money (M-Pesa / MTN)</span>
                        <p className="text-[10px] text-stone-500">{store.mobileMoneyName}: {store.mobileMoneyNumber}</p>
                      </div>
                    </label>
                  )}

                  {store.acceptsCashOnDelivery && (
                    <label className="flex items-center gap-2 p-2.5 border rounded-lg cursor-pointer bg-stone-50/60 hover:bg-stone-50">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-stone-900">Cash on Delivery / Pickup</span>
                        <p className="text-[10px] text-stone-500">Pay cash or mobile money when you receive items.</p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Order Calculation */}
              <div className="pt-4 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">{store.currencySymbol} {cartSubtotal.toLocaleString()}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-mono">{store.currencySymbol} {deliveryFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                  <span>Total Due:</span>
                  <span className="font-mono">{store.currencySymbol} {grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2 sticky bottom-0">
              <button
                onClick={() => handleCheckout(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span>Order via WhatsApp (Recommended)</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCheckout(false)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs transition-colors"
              >
                Submit Instant Order Directly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmed Receipt Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-stone-900">Order Received!</h3>
            <p className="text-xs text-stone-500 mt-1">
              Order #{confirmedOrder.id} has been transmitted to {store.name}.
            </p>

            <div className="my-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between text-stone-500">
                <span>Total Amount:</span>
                <span className="font-bold text-stone-900 font-mono">
                  {store.currencySymbol} {confirmedOrder.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Method:</span>
                <span className="capitalize">{confirmedOrder.paymentMethod.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Estimated Time:</span>
                <span className="font-semibold text-emerald-700">~25-35 minutes</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 mb-4">
              The merchant has been notified and will prepare your order. You can chat with them anytime on WhatsApp.
            </p>

            <div className="space-y-2">
              <a
                href={`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${store.name}, following up on my order #${confirmedOrder.id}!`)}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Track / Chat with Merchant on WhatsApp
              </a>
              <button
                onClick={() => setConfirmedOrder(null)}
                className="w-full py-2 text-stone-600 hover:text-stone-900 text-xs font-medium"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
