import React, { useState } from 'react';
import { Store } from '../types/store';
import { 
  Search, 
  MapPin, 
  Star, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Utensils, 
  Scissors, 
  Cake 
} from 'lucide-react';

interface DiscoveryMarketplaceProps {
  stores: Store[];
  onSelectStore: (store: Store) => void;
  onOpenCreateStore: () => void;
}

export const DiscoveryMarketplace: React.FC<DiscoveryMarketplaceProps> = ({
  stores,
  onSelectStore,
  onOpenCreateStore
}) => {
  const [selectedTown, setSelectedTown] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract towns
  const towns = ['All', ...Array.from(new Set(stores.map(s => s.town)))];
  const categories = [
    { id: 'All', label: 'All Businesses' },
    { id: 'food', label: 'Food & Kitchen', icon: Utensils },
    { id: 'salon', label: 'Hair & Beauty', icon: Scissors },
    { id: 'bakery', label: 'Bakeries', icon: Cake }
  ];

  const filteredStores = stores.filter(store => {
    const matchesTown = selectedTown === 'All' || store.town.toLowerCase() === selectedTown.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || store.category === selectedCategory;
    const matchesSearch =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.items.some(it => it.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTown && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1 rounded-full">
            Local Town Discovery
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Order directly from authentic local businesses in your town
          </h1>

          <p className="text-sm text-stone-300 leading-relaxed max-w-xl">
            Skip expensive delivery app markups. Support neighborhood food vendors, talented hair stylists, and artisanal bakers with zero-hassle WhatsApp ordering.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateStore}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your Storefront in 2 Mins</span>
            </button>
            <span className="text-xs text-stone-400">100% Free Starter Plan</span>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by food dish, salon style, or business name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Town Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <span className="text-xs text-stone-400 flex items-center gap-1 mr-1">
              <MapPin className="w-3.5 h-3.5" />
              Town:
            </span>
            {towns.map(town => (
              <button
                key={town}
                onClick={() => setSelectedTown(town)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedTown === town
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {town}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 border-t border-stone-100 pt-3 overflow-x-auto no-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map(store => (
          <div
            key={store.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-stone-300 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Photo */}
              <div className="h-44 w-full bg-stone-100 relative overflow-hidden">
                {store.bannerImage ? (
                  <img
                    src={store.bannerImage}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-800 flex items-center justify-center text-white font-bold">
                    {store.name}
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-stone-800 shadow-xs">
                  {store.town}
                </div>
                <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-white flex items-center gap-1 shadow-xs">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{store.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-2">
                <div>
                  <h3 className="text-base font-bold text-stone-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-1">{store.tagline}</p>
                </div>

                {/* Popular items preview */}
                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Featured Items ({store.items.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {store.items.slice(0, 3).map(it => (
                      <span
                        key={it.id}
                        className="text-[11px] bg-stone-50 text-stone-700 px-2 py-0.5 rounded border border-stone-100 truncate max-w-[140px]"
                      >
                        {it.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 pt-0">
              <button
                onClick={() => onSelectStore(store)}
                className="w-full py-2.5 bg-stone-900 group-hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>View Store & Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
