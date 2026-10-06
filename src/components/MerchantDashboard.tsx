import React, { useState } from 'react';
import { Store, StoreItem, StoreOrder } from '../types/store';
import { 
  ShoppingBag, 
  DollarSign, 
  Eye, 
  MessageSquare, 
  QrCode, 
  Share2, 
  Plus, 
  ExternalLink, 
  Check, 
  Clock, 
  Trash2, 
  Sparkles, 
  Smartphone, 
  AlertCircle,
  Copy,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { FlyerMaker } from './FlyerMaker';
import { 
  createWhatsAppShareLink, 
  createOrderStatusUpdateWhatsApp, 
  createReviewRequestWhatsApp 
} from '../utils/whatsapp';

interface MerchantDashboardProps {
  store: Store;
  orders: StoreOrder[];
  onUpdateStore: (updatedStore: Store) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: StoreOrder['status']) => void;
  onViewLiveStorefront: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  store,
  orders,
  onUpdateStore,
  onUpdateOrderStatus,
  onViewLiveStorefront
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'share' | 'flyer' | 'plans'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'new' | 'preparing' | 'ready' | 'completed'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // New item modal state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Mains');
  const [newItemPrice, setNewItemPrice] = useState(300);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('per plate');

  // Stats calculation
  const storeOrders = orders.filter(o => o.storeId === store.id);
  const totalSales = storeOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);
  const newOrdersCount = storeOrders.filter(o => o.status === 'new').length;

  const filteredOrders = orderFilter === 'all'
    ? storeOrders
    : storeOrders.filter(o => o.status === orderFilter);

  const toggleStoreOpen = () => {
    onUpdateStore({ ...store, isOpen: !store.isOpen });
  };

  const handleCopyStoreLink = () => {
    const url = `${window.location.origin}/?store=${store.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `${window.location.origin}/?store=${store.slug}`;
    const shareUrl = createWhatsAppShareLink(store, url);
    window.open(shareUrl, '_blank');
  };

  // Add Item to Catalog
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || newItemPrice <= 0) return;

    const newItem: StoreItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      category: newItemCategory,
      description: newItemDescription,
      price: Number(newItemPrice),
      image: store.bannerImage,
      isAvailable: true,
      type: store.category === 'salon' ? 'service' : 'product',
      estimatedTime: '15 mins',
      unit: newItemUnit
    };

    onUpdateStore({
      ...store,
      items: [...store.items, newItem]
    });

    setNewItemName('');
    setNewItemDescription('');
    setNewItemPrice(300);
    setIsAddItemOpen(false);
  };

  const toggleItemAvailability = (itemId: string) => {
    const updatedItems = store.items.map(item =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    );
    onUpdateStore({ ...store, items: updatedItems });
  };

  const deleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = store.items.filter(item => item.id !== itemId);
      onUpdateStore({ ...store, items: updatedItems });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Merchant Identity & Action Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">{store.name}</h1>
            <button
              onClick={toggleStoreOpen}
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                store.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {store.isOpen ? '● Open for Orders' : '○ Closed'}
            </button>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            {store.town} · {store.tagline} · WhatsApp: {store.phone}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onViewLiveStorefront}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Customer Link</span>
          </button>

          <button
            onClick={handleCopyStoreLink}
            className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share to WhatsApp</span>
          </button>
        </div>
      </div>

      {/* 4 Quantitative Business Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">Total Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {store.currencySymbol} {totalSales.toLocaleString()}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">Live collected & pending</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">Orders Today</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {storeOrders.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
            {newOrdersCount} new needing attention
          </span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">Storefront Views</span>
            <Eye className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {store.viewsCount}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">From WhatsApp & local web</span>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-500">WhatsApp Clicks</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {store.whatsappClicks}
          </p>
          <span className="text-[11px] text-stone-400 mt-1 block">~28.6% conversion rate</span>
        </div>
      </div>

      {/* Navigation Tabs (Zero-pill segmented buttons) */}
      <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'orders'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Orders & Bookings</span>
          {newOrdersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-emerald-600 text-white text-[10px] rounded-full font-mono">
              {newOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Catalog & Menu ({store.items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('share')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'share'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>QR & Social Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('flyer')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'flyer'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Flyer & Promo Maker</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'plans'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Pricing & Monetization</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & BOOKINGS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1">
              {(['all', 'new', 'preparing', 'ready', 'completed'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setOrderFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                    orderFilter === filter
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400">
              Showing {filteredOrders.length} orders
            </p>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-stone-800">No orders in this status</h3>
              <p className="text-xs text-stone-500 mt-1">
                Share your storefront link to start receiving incoming orders on WhatsApp!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map(order => {
                const updateLink = createOrderStatusUpdateWhatsApp(
                  order,
                  store,
                  order.status === 'new'
                    ? 'Preparing your order'
                    : order.status === 'preparing'
                    ? 'Out for delivery'
                    : 'Order completed'
                );

                const reviewLink = createReviewRequestWhatsApp(
                  order.customerName,
                  order.customerPhone,
                  store
                );

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                        <div>
                          <span className="font-bold font-mono text-xs text-stone-900">#{order.id}</span>
                          <span className="text-[11px] text-stone-400 ml-2">· {order.createdAt}</span>
                        </div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                          order.status === 'new'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'ready'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-2.5">
                        <p className="text-sm font-bold text-stone-900">{order.customerName}</p>
                        <p className="text-xs text-stone-500">{order.customerPhone}</p>
                        {order.deliveryAddress && (
                          <p className="text-xs text-stone-600 mt-1 bg-stone-50 p-2 rounded-lg border border-stone-200">
                            🛵 <strong>Deliver to:</strong> {order.deliveryAddress}
                          </p>
                        )}
                        {order.notes && (
                          <p className="text-xs text-amber-800 mt-1 italic">
                            Note: "{order.notes}"
                          </p>
                        )}
                      </div>

                      {/* Items breakdown */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-stone-600">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono">{store.currencySymbol} {(it.price * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs font-bold text-stone-900 pt-2 border-t border-stone-100">
                          <span>Total Amount:</span>
                          <span className="font-mono">{store.currencySymbol} {order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-400">
                          <span>Payment Method:</span>
                          <span className="capitalize">{order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Action Controls */}
                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      <div className="grid grid-cols-3 gap-1 text-[11px]">
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                          className={`py-1 rounded font-medium border text-center transition-colors ${
                            order.status === 'preparing' ? 'bg-blue-600 text-white' : 'hover:bg-stone-50'
                          }`}
                        >
                          Preparing
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                          className={`py-1 rounded font-medium border text-center transition-colors ${
                            order.status === 'ready' ? 'bg-purple-600 text-white' : 'hover:bg-stone-50'
                          }`}
                        >
                          Ready
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                          className={`py-1 rounded font-medium border text-center transition-colors ${
                            order.status === 'completed' ? 'bg-emerald-600 text-white' : 'hover:bg-stone-50'
                          }`}
                        >
                          Completed
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={updateLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>WhatsApp Update</span>
                        </a>

                        {order.status === 'completed' && (
                          <a
                            href={reviewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium text-center transition-colors"
                            title="Request Customer Review"
                          >
                            ⭐ Request Review
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATALOG & MENU */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Manage Products & Services</h3>
              <p className="text-xs text-stone-500">Edit prices, toggle stock, or add new items to your storefront.</p>
            </div>
            <button
              onClick={() => setIsAddItemOpen(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Item</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
            {store.items.map(item => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 uppercase font-medium">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5">{item.description}</p>
                    <p className="text-xs font-mono font-bold text-stone-800 mt-1">
                      {store.currencySymbol} {item.price.toLocaleString()} {item.unit && `· ${item.unit}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => toggleItemAvailability(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      item.isAvailable
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-rose-200 bg-rose-50 text-rose-800'
                    }`}
                  >
                    {item.isAvailable ? 'In Stock' : 'Sold Out'}
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-50 rounded-lg transition-colors"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Item Modal */}
          {isAddItemOpen && (
            <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
                <h3 className="text-base font-bold text-stone-900 mb-3">Add Product or Service</h3>
                <form onSubmit={handleAddNewItem} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Item Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Swahili Biryani Special"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Mains, Sides, Drinks"
                        value={newItemCategory}
                        onChange={e => setNewItemCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Price ({store.currencySymbol}) *</label>
                      <input
                        type="number"
                        value={newItemPrice}
                        onChange={e => setNewItemPrice(Number(e.target.value))}
                        className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Portion / Unit</label>
                    <input
                      type="text"
                      placeholder="e.g. per plate, per session, per box"
                      value={newItemUnit}
                      onChange={e => setNewItemUnit(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
                    <textarea
                      placeholder="Ingredients, preparation details, or service inclusions..."
                      value={newItemDescription}
                      onChange={e => setNewItemDescription(e.target.value)}
                      rows={2}
                      className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddItemOpen(false)}
                      className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                    >
                      Save to Store
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SHARE, QR & WHATSAPP HUB */}
      {activeTab === 'share' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Printable QR Code Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col items-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-3">
              Table Tent & Counter Display
            </span>
            <h3 className="text-lg font-bold text-stone-900">{store.name}</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs">
              Scan to view digital menu, order food or book services on your phone!
            </p>

            {/* Visual SVG QR Stand */}
            <div className="my-6 p-6 bg-stone-50 border-2 border-dashed border-stone-300 rounded-2xl relative shadow-inner">
              <div className="w-48 h-48 bg-white p-3 rounded-xl border border-stone-200 flex flex-col items-center justify-center shadow-xs">
                {/* Clean geometric QR representation */}
                <div className="w-full h-full bg-stone-900 rounded-lg p-2 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-9 h-9 border-4 border-white bg-stone-900 rounded-sm" />
                    <div className="w-9 h-9 border-4 border-white bg-stone-900 rounded-sm" />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-7 h-7 bg-emerald-500 rounded-md flex items-center justify-center text-white text-[9px] font-black">
                      KWIK
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-9 h-9 border-4 border-white bg-stone-900 rounded-sm" />
                    <div className="w-6 h-6 bg-white/80 rounded-xs self-end" />
                  </div>
                </div>
              </div>
              <p className="text-[11px] font-mono font-bold text-stone-800 mt-3">
                kwikshop.live/{store.slug}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Storefront Counter Stand</span>
            </button>
          </div>

          {/* WhatsApp Direct Share & Social Captions */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp Broadcast Template
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                One-tap broadcast to your WhatsApp contacts and groups.
              </p>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono text-stone-700 whitespace-pre-wrap leading-relaxed">
{`👋 Hello from ${store.name}!
Order fresh food & goods directly from our new mobile shop link:
👉 ${window.location.origin}/?store=${store.slug}

📍 ${store.town} · Fast delivery or pickup available!`}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Send to WhatsApp Now</span>
                </button>
                <button
                  onClick={handleCopyStoreLink}
                  className="px-3 py-2 border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium rounded-lg"
                >
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-1">
                Instagram & Facebook Bio Link
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                Paste this into your Instagram profile bio so followers can order 24/7.
              </p>
              <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/?store=${store.slug}`}
                  className="text-xs font-mono bg-transparent flex-1 text-stone-800 outline-none"
                />
                <button
                  onClick={handleCopyStoreLink}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FLYER & PROMO STUDIO */}
      {activeTab === 'flyer' && (
        <FlyerMaker store={store} />
      )}

      {/* TAB 5: MONETIZATION & PRICING PLANS */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="text-center max-w-lg mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Transparent Pricing Model
            </span>
            <h3 className="text-xl font-bold text-stone-900 mt-2">
              Start Free, Scale as You Grow
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Zero upfront investment. Keep your full revenue with our free starter plan, or upgrade to Pro when you need automated mobile payments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
            {/* Free Starter Plan */}
            <div className="p-6 rounded-2xl border-2 border-stone-200 bg-white flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Free Starter</span>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-extrabold text-stone-900">$0</span>
                  <span className="text-xs text-stone-500">/ forever</span>
                </div>
                <p className="text-xs text-stone-600 mb-4">
                  Ideal for testing your first 10-20 customers in your town.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-600 border-t border-stone-100 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant storefront web link & menu</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unlimited WhatsApp direct ordering</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Printable QR table & counter stand</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Free social flyer generator</span>
                  </li>
                  <li className="flex items-center gap-2 text-stone-400">
                    <span>— Automated M-Pesa STK push</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <span className="block text-center text-xs font-semibold py-2 px-4 rounded-lg bg-stone-100 text-stone-700">
                  Current Active Plan
                </span>
              </div>
            </div>

            {/* Pro Growth Plan */}
            <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 relative flex flex-col justify-between shadow-sm">
              <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                Recommended for Growth
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Pro Growth</span>
                <div className="flex items-baseline gap-1 mt-2 mb-4">
                  <span className="text-3xl font-extrabold text-stone-900">$5</span>
                  <span className="text-xs text-stone-500">/ month (KSh 650)</span>
                </div>
                <p className="text-xs text-stone-600 mb-4">
                  Automate payments, customer broadcast notifications, and custom branding.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-700 border-t border-emerald-200/50 pt-4">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Everything in Free Starter</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold text-emerald-950">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Automated M-Pesa / MTN Mobile Money STK Prompt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bulk WhatsApp Broadcast to recent customers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Custom domain (e.g. mama-kitchen.com)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Advanced analytics & customer re-order alerts</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-emerald-200/50">
                <button
                  onClick={() => alert('Pro subscription preview: Mobile Money payment gateway integration ready.')}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  Upgrade to Pro ($5/mo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
