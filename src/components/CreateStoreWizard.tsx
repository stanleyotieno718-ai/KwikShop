import React, { useState } from 'react';
import { Store, StoreCategory, StoreItem } from '../types/store';
import { Store as StoreIcon, ArrowRight, ArrowLeft, Check, Sparkles, Smartphone, MapPin, DollarSign, Clock, Plus, Trash2 } from 'lucide-react';

interface CreateStoreWizardProps {
  onStoreCreated: (newStore: Store) => void;
  onCancel: () => void;
}

const CATEGORY_PRESETS: Record<StoreCategory, { label: string; items: Omit<StoreItem, 'id'>[] }> = {
  food: {
    label: 'Food, Kitchen & Catering',
    items: [
      {
        name: 'Spiced Beef Pilau Special',
        category: 'Mains',
        description: 'Fragrant coastal spiced beef pilau served with fresh kachumbari.',
        price: 450,
        isAvailable: true,
        type: 'product',
        estimatedTime: '15 mins',
        unit: 'plate'
      },
      {
        name: 'Whole Fried Fish & Ugali',
        category: 'Mains',
        description: 'Crispy whole Lake Victoria tilapia with traditional greens.',
        price: 600,
        isAvailable: true,
        type: 'product',
        estimatedTime: '20 mins',
        unit: 'portion'
      },
      {
        name: 'Crispy Samosas (3 pcs)',
        category: 'Bites',
        description: 'Golden pastry pockets filled with seasoned ground meat and spices.',
        price: 200,
        isAvailable: true,
        type: 'product',
        estimatedTime: '5 mins',
        unit: '3 pcs'
      },
      {
        name: 'Fresh Cold-Pressed Juice',
        category: 'Drinks',
        description: 'Fresh local tropical passion fruit and mango blend (500ml).',
        price: 150,
        isAvailable: true,
        type: 'product',
        estimatedTime: '5 mins',
        unit: '500ml'
      }
    ]
  },
  salon: {
    label: 'Hair Salon, Braids & Beauty',
    items: [
      {
        name: 'Knotless Box Braids (Mid-Back)',
        category: 'Braids',
        description: 'Painless, lightweight protective knotless braids with neat parts.',
        price: 3200,
        isAvailable: true,
        type: 'service',
        estimatedTime: '3.5 hrs',
        unit: 'session'
      },
      {
        name: 'Gel Polish Manicure',
        category: 'Nails',
        description: 'Precision cuticle treatment and long-lasting glossy gel polish.',
        price: 1500,
        isAvailable: true,
        type: 'service',
        estimatedTime: '45 mins',
        unit: 'session'
      },
      {
        name: 'Hair Wash & Silk Press',
        category: 'Styling',
        description: 'Steam conditioning therapy followed by sleek thermal silk press.',
        price: 2200,
        isAvailable: true,
        type: 'service',
        estimatedTime: '90 mins',
        unit: 'session'
      }
    ]
  },
  bakery: {
    label: 'Artisanal Bakery & Pastries',
    items: [
      {
        name: 'Vanilla Glazed Cinnamon Rolls (Pack of 4)',
        category: 'Pastries',
        description: 'Freshly baked warm soft rolls topped with rich cream cheese glaze.',
        price: 800,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'Ready',
        unit: 'box of 4'
      },
      {
        name: 'Artisan Country Sourdough Loaf',
        category: 'Breads',
        description: 'Naturally leavened crispy golden bread with open chewy crumb.',
        price: 450,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'Fresh daily',
        unit: 'loaf'
      },
      {
        name: 'Custom Celebration Cake (1kg)',
        category: 'Cakes',
        description: 'Moist vanilla or chocolate sponge with custom lettering.',
        price: 2500,
        isAvailable: true,
        type: 'product',
        estimatedTime: '24 hr pre-order',
        unit: '1kg cake'
      }
    ]
  },
  craft: {
    label: 'Handmade Crafts & Fashion',
    items: [
      {
        name: 'Handcrafted Leather Sandals',
        category: 'Footwear',
        description: 'Genuine durable leather beaded slip-on sandals.',
        price: 1800,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'In stock',
        unit: 'pair'
      },
      {
        name: 'Woven Sisal Kiondo Tote Bag',
        category: 'Accessories',
        description: 'Traditional durable woven bag with leather shoulder straps.',
        price: 1400,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'In stock',
        unit: 'piece'
      }
    ]
  },
  retail: {
    label: 'Local Shop & General Retail',
    items: [
      {
        name: 'Premium Household Combo Pack',
        category: 'Bundles',
        description: 'Essential cooking oil, rice, sugar, and flour pack.',
        price: 1650,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'Immediate',
        unit: 'bundle'
      }
    ]
  },
  grocery: {
    label: 'Fresh Produce & Farm Grocery',
    items: [
      {
        name: 'Farm-Fresh Veggie Box',
        category: 'Greens',
        description: 'Crisp spinach, sukuma wiki, tomatoes, onions, and coriander.',
        price: 650,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'Fresh morning harvest',
        unit: 'crate'
      }
    ]
  }
};

export const CreateStoreWizard: React.FC<CreateStoreWizardProps> = ({ onStoreCreated, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<StoreCategory>('food');
  const [town, setTown] = useState('Kisumu');
  const [address, setAddress] = useState('');
  const [tagline, setTagline] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [hours, setHours] = useState('Mon - Sat: 8:30 AM - 8:00 PM');
  const [deliveryFee, setDeliveryFee] = useState(100);

  // Items
  const [catalogItems, setCatalogItems] = useState<{ name: string; category: string; description: string; price: number; type: 'product' | 'service'; unit: string }[]>(
    CATEGORY_PRESETS.food.items.map(item => ({ ...item, unit: item.unit || 'item' }))
  );

  // Payments
  const [acceptsMobileMoney, setAcceptsMobileMoney] = useState(true);
  const [mobileMoneyName, setMobileMoneyName] = useState('M-Pesa Buy Goods Till');
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState('');
  const [acceptsCashOnDelivery, setAcceptsCashOnDelivery] = useState(true);

  // When category changes in step 1, load starter items
  const handleCategoryChange = (newCat: StoreCategory) => {
    setCategory(newCat);
    setCatalogItems(CATEGORY_PRESETS[newCat].items.map(item => ({ ...item, unit: item.unit || 'item' })));
  };

  const handleUpdateItemPrice = (index: number, newPrice: number) => {
    const updated = [...catalogItems];
    updated[index].price = newPrice;
    setCatalogItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setCatalogItems(catalogItems.filter((_, i) => i !== index));
  };

  const handleAddCustomItem = () => {
    setCatalogItems([
      ...catalogItems,
      {
        name: 'New Item',
        category: 'General',
        description: 'Fresh quality item or service description.',
        price: 300,
        type: category === 'salon' ? 'service' : 'product',
        unit: 'portion'
      }
    ]);
  };

  const handleFinish = () => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'my-shop';
    const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '') || '254700000000';

    const newStore: Store = {
      id: `store-${Date.now()}`,
      slug,
      name: name || 'My Local Store',
      tagline: tagline || `Best ${CATEGORY_PRESETS[category].label} in ${town}`,
      description: `Welcome to ${name || 'our shop'}. Order fresh products or book services directly via WhatsApp in ${town}.`,
      category,
      town: town || 'Kisumu',
      address: address || `${town} Central Market`,
      phone: whatsappNumber.startsWith('+') ? whatsappNumber : `+${cleanPhone}`,
      whatsappNumber: cleanPhone,
      currency: 'KES',
      currencySymbol: 'KSh',
      hours,
      isOpen: true,
      deliveryFee: Number(deliveryFee) || 0,
      minimumOrder: 100,
      acceptsCashOnDelivery,
      acceptsMobileMoney,
      mobileMoneyName: mobileMoneyName || 'M-Pesa Till',
      mobileMoneyNumber: mobileMoneyNumber || 'Ask on WhatsApp',
      acceptsCard: true,
      rating: 5.0,
      reviewCount: 1,
      viewsCount: 1,
      whatsappClicks: 0,
      createdAt: new Date().toISOString().split('T')[0],
      items: catalogItems.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        name: item.name,
        category: item.category,
        description: item.description,
        price: item.price,
        isAvailable: true,
        type: item.type,
        estimatedTime: '15 mins',
        unit: item.unit
      }))
    };

    onStoreCreated(newStore);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8">
        {/* Wizard Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Launch Your Storefront in 2 Mins</h2>
              <p className="text-xs text-stone-300">Step {step} of 3 · Zero coding needed</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-stone-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg border border-stone-700 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5">
          <div
            className="bg-emerald-500 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-6">
          {/* STEP 1: BUSINESS DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mama Otieno Kitchen, Imani Braids Studio"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => handleCategoryChange(e.target.value as StoreCategory)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="food">Street Food & Restaurant</option>
                    <option value="salon">Hair Salon & Beauty</option>
                    <option value="bakery">Bakery & Pastries</option>
                    <option value="craft">Handmade Crafts & Fashion</option>
                    <option value="grocery">Fresh Groceries & Produce</option>
                    <option value="retail">Local Shop & Retail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kisumu, Nairobi, Mombasa"
                    value={town}
                    onChange={e => setTown(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  WhatsApp Number (for receiving orders) *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="+254 712 345 678"
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Customers will click to send pre-formatted order details straight to this WhatsApp number.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Hot Meals Daily · Free Delivery in CBD"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!name.trim()}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                  Continue to Menu
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: STARTER CATALOG */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Customize Starter Catalog</h3>
                  <p className="text-xs text-stone-500">We auto-populated popular items for {CATEGORY_PRESETS[category].label}. Adjust prices or add more!</p>
                </div>
                <button
                  onClick={handleAddCustomItem}
                  className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </button>
              </div>

              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {catalogItems.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white px-2 py-1">
                        <span className="text-xs text-stone-400 mr-1">KSh</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={e => handleUpdateItemPrice(index, Number(e.target.value))}
                          className="w-16 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
                >
                  Continue to Payments
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENTS & LAUNCH */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Payment & Ordering Options</h3>
                <p className="text-xs text-stone-500">Choose how customers can pay when ordering from your storefront.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 border border-stone-200 rounded-xl flex items-start gap-3 bg-stone-50/50">
                  <input
                    type="checkbox"
                    id="momo"
                    checked={acceptsMobileMoney}
                    onChange={e => setAcceptsMobileMoney(e.target.checked)}
                    className="mt-1 h-4 w-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="momo" className="text-xs font-bold text-stone-900 block cursor-pointer">
                      Mobile Money (M-Pesa / MTN MoMo)
                    </label>
                    <p className="text-[11px] text-stone-500">Most popular payment method across East & West Africa.</p>

                    {acceptsMobileMoney && (
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Account Name / Till"
                          value={mobileMoneyName}
                          onChange={e => setMobileMoneyName(e.target.value)}
                          className="text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Till / Paybill Number"
                          value={mobileMoneyNumber}
                          onChange={e => setMobileMoneyNumber(e.target.value)}
                          className="text-xs px-2.5 py-1.5 border border-stone-200 rounded-lg bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3.5 border border-stone-200 rounded-xl flex items-start gap-3 bg-stone-50/50">
                  <input
                    type="checkbox"
                    id="cod"
                    checked={acceptsCashOnDelivery}
                    onChange={e => setAcceptsCashOnDelivery(e.target.checked)}
                    className="mt-1 h-4 w-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="cod" className="text-xs font-bold text-stone-900 block cursor-pointer">
                      Cash on Delivery / Pickup
                    </label>
                    <p className="text-[11px] text-stone-500">Allow customers to pay in person upon receiving the goods.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-stone-800 uppercase tracking-wider mb-1">
                    Standard Delivery Fee (KSh)
                  </label>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={e => setDeliveryFee(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-md transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Launch Storefront Now!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
