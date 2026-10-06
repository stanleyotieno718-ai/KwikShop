import React from 'react';
import { Store as StoreIcon, Plus, Store } from 'lucide-react';

interface NavbarProps {
  currentView: 'marketplace' | 'storefront' | 'dashboard';
  onChangeView: (view: 'marketplace' | 'storefront' | 'dashboard') => void;
  onOpenCreateStore: () => void;
  activeStoreName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  onOpenCreateStore,
  activeStoreName
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onChangeView('marketplace')}
          className="text-base font-extrabold tracking-tight text-stone-900 flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
            K
          </span>
          <span className="font-display">KwikShop</span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <button
            onClick={() => onChangeView('marketplace')}
            className={`transition-colors hover:text-stone-900 ${
              currentView === 'marketplace' ? 'text-emerald-700 underline underline-offset-8' : ''
            }`}
          >
            Explore Towns
          </button>

          <button
            onClick={() => onChangeView('storefront')}
            className={`transition-colors hover:text-stone-900 ${
              currentView === 'storefront' ? 'text-emerald-700 underline underline-offset-8' : ''
            }`}
          >
            Customer Storefront {activeStoreName ? `(${activeStoreName.slice(0, 14)}...)` : ''}
          </button>

          <button
            onClick={() => onChangeView('dashboard')}
            className={`transition-colors hover:text-stone-900 ${
              currentView === 'dashboard' ? 'text-emerald-700 underline underline-offset-8' : ''
            }`}
          >
            Merchant Admin
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCreateStore}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Storefront</span>
          </button>
        </div>
      </div>
    </header>
  );
};
