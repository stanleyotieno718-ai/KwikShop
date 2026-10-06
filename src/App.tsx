import React, { useState, useEffect } from 'react';
import { Store, StoreOrder } from './types/store';
import { INITIAL_STORES, INITIAL_ORDERS } from './data/seedStores';
import { Navbar } from './components/Navbar';
import { CustomerStorefront } from './components/CustomerStorefront';
import { MerchantDashboard } from './components/MerchantDashboard';
import { DiscoveryMarketplace } from './components/DiscoveryMarketplace';
import { CreateStoreWizard } from './components/CreateStoreWizard';
import { Smartphone, Store as StoreIcon, Compass, Sparkles } from 'lucide-react';

export default function App() {
  // Persistence via localStorage with seed fallback
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const saved = localStorage.getItem('kwikshop_stores');
      return saved ? JSON.parse(saved) : INITIAL_STORES;
    } catch {
      return INITIAL_STORES;
    }
  });

  const [orders, setOrders] = useState<StoreOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kwikshop_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [activeStoreId, setActiveStoreId] = useState<string>(() => {
    // Check URL query param ?store=
    const params = new URLSearchParams(window.location.search);
    const storeParam = params.get('store');
    if (storeParam) {
      const match = INITIAL_STORES.find(s => s.slug === storeParam || s.id === storeParam);
      if (match) return match.id;
    }
    return INITIAL_STORES[0].id;
  });

  const [currentView, setCurrentView] = useState<'marketplace' | 'storefront' | 'dashboard'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('store') ? 'storefront' : 'marketplace';
  });

  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kwikshop_stores', JSON.stringify(stores));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [stores]);

  useEffect(() => {
    try {
      localStorage.setItem('kwikshop_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0];

  const handlePlaceOrder = (newOrder: StoreOrder) => {
    setOrders(prev => [newOrder, ...prev]);

    // Increment store views/clicks
    setStores(prev =>
      prev.map(s => {
        if (s.id === newOrder.storeId) {
          return {
            ...s,
            viewsCount: s.viewsCount + 1,
            whatsappClicks: s.whatsappClicks + 1
          };
        }
        return s;
      })
    );

    showToast(`Order #${newOrder.id} successfully recorded! Check merchant dashboard.`);
  };

  const handleUpdateStore = (updatedStore: Store) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
    showToast('Store settings updated!');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: StoreOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} marked as ${newStatus}!`);
  };

  const handleStoreCreated = (newStore: Store) => {
    setStores(prev => [newStore, ...prev]);
    setActiveStoreId(newStore.id);
    setIsCreateStoreOpen(false);
    setCurrentView('dashboard');
    showToast(`🎉 "${newStore.name}" is now live!`);
  };

  const handleSelectStoreFromDirectory = (store: Store) => {
    setActiveStoreId(store.id);
    setCurrentView('storefront');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between text-stone-900">
      <div>
        {/* Navigation Bar */}
        <Navbar
          currentView={currentView}
          onChangeView={setCurrentView}
          onOpenCreateStore={() => setIsCreateStoreOpen(true)}
          activeStoreName={activeStore?.name}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border border-stone-700 animate-in slide-in-from-top-2 duration-200">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main>
          {currentView === 'marketplace' && (
            <DiscoveryMarketplace
              stores={stores}
              onSelectStore={handleSelectStoreFromDirectory}
              onOpenCreateStore={() => setIsCreateStoreOpen(true)}
            />
          )}

          {currentView === 'storefront' && activeStore && (
            <CustomerStorefront
              store={activeStore}
              onPlaceOrder={handlePlaceOrder}
              onBackToDirectory={() => setCurrentView('marketplace')}
              onOpenOwnerDashboard={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'dashboard' && activeStore && (
            <MerchantDashboard
              store={activeStore}
              orders={orders}
              onUpdateStore={handleUpdateStore}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onViewLiveStorefront={() => setCurrentView('storefront')}
            />
          )}
        </main>
      </div>

      {/* Floating Mode Switcher Bar */}
      <div className="sticky bottom-3 z-30 flex justify-center px-4 pointer-events-none">
        <div className="bg-stone-900/90 backdrop-blur-md text-white p-1.5 rounded-2xl shadow-xl border border-stone-700/60 flex items-center gap-1 pointer-events-auto">
          <button
            onClick={() => setCurrentView('marketplace')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'marketplace'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Town Hub</span>
          </button>

          <button
            onClick={() => setCurrentView('storefront')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'storefront'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Customer View</span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <StoreIcon className="w-3.5 h-3.5" />
            <span>Owner Admin</span>
          </button>
        </div>
      </div>

      {/* 2-Minute Onboarding Wizard */}
      {isCreateStoreOpen && (
        <CreateStoreWizard
          onStoreCreated={handleStoreCreated}
          onCancel={() => setIsCreateStoreOpen(false)}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-stone-200 py-6 bg-white text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-display">KwikShop</span>
            <span>· Instant Storefronts & WhatsApp Commerce</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Built for local food vendors, salons & neighbourhood artisans</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
