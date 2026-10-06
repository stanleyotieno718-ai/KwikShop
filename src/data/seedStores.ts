import { Store } from '../types/store';

import foodPilauImg from '../assets/images/food_swahili_pilau_1791278584605.jpg';
import salonBraidsImg from '../assets/images/beauty_braids_salon_1791278596193.jpg';
import bakeryPastriesImg from '../assets/images/bakery_pastries_display_1791278606189.jpg';
import marketHeroImg from '../assets/images/storefront_hero_market_1791278616947.jpg';

export const INITIAL_STORES: Store[] = [
  {
    id: 'store-mama-ochieng',
    slug: 'mama-ochieng-kitchen',
    name: "Mama Ochieng's Coastal Kitchen",
    tagline: 'Authentic Swahili Dishes & Fresh Coastal Flavors',
    description: 'Hot, freshly cooked lunch & dinner made daily in Kisumu. Spiced beef pilau, whole fried fish, coconut curries, and tropical fresh juices.',
    category: 'food',
    town: 'Kisumu',
    address: 'Oginga Odinga Street, Next to Swan Centre, Kisumu',
    phone: '+254712345678',
    whatsappNumber: '254712345678',
    currency: 'KES',
    currencySymbol: 'KSh',
    bannerImage: foodPilauImg,
    avatarImage: marketHeroImg,
    hours: 'Mon - Sat: 9:00 AM - 8:30 PM',
    isOpen: true,
    deliveryFee: 100,
    minimumOrder: 300,
    acceptsCashOnDelivery: true,
    acceptsMobileMoney: true,
    mobileMoneyName: 'M-Pesa Buy Goods Till',
    mobileMoneyNumber: '5829104',
    acceptsCard: true,
    rating: 4.9,
    reviewCount: 38,
    viewsCount: 642,
    whatsappClicks: 184,
    createdAt: '2026-09-15',
    items: [
      {
        id: 'item-pilau-plate',
        name: 'Swahili Spiced Beef Pilau Special',
        category: 'Main Dishes',
        description: 'Tender beef simmered in fragrant coastal spices and basmati rice, served with fresh kachumbari salad and lime.',
        price: 450,
        image: foodPilauImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: '15 mins',
        unit: 'per plate'
      },
      {
        id: 'item-fish-curry',
        name: 'Whole Tilapia with Coconut Samaki Sauce',
        category: 'Main Dishes',
        description: 'Crispy fried Lake Victoria tilapia simmered in rich coconut tamarind sauce with ugali or brown rice.',
        price: 650,
        image: foodPilauImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: '20 mins',
        unit: 'per whole fish'
      },
      {
        id: 'item-samosa-trio',
        name: 'Crispy Beef Samosas (Pair of 3)',
        category: 'Quick Bites',
        description: 'Golden triangular pastry pockets packed with spiced minced beef, coriander, and mild chili.',
        price: 200,
        image: bakeryPastriesImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: '10 mins',
        unit: '3 pieces'
      },
      {
        id: 'item-passion-juice',
        name: 'Cold-Pressed Fresh Passion Juice',
        category: 'Drinks & Refreshment',
        description: '500ml chilled natural sweet passion fruit juice, fresh from local farmers with no artificial preservatives.',
        price: 150,
        image: foodPilauImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: '5 mins',
        unit: '500ml bottle'
      },
      {
        id: 'item-mandazi-chai',
        name: 'Cardamom Mahamri & Spiced Masala Chai',
        category: 'Quick Bites',
        description: 'Fluffy Swahili coconut cardamom donuts served alongside a warm cup of rich ginger-spiced tea.',
        price: 180,
        image: bakeryPastriesImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: '10 mins',
        unit: 'combo set'
      }
    ]
  },
  {
    id: 'store-amani-glow',
    slug: 'amani-glow-lounge',
    name: 'Amani Glow Hair & Braids Lounge',
    tagline: 'Modern Protective Styling & Clean Beauty Care',
    description: 'Specializing in painless knotless braids, bohemian twists, natural locs treatment, and gel nail artistry.',
    category: 'salon',
    town: 'Nairobi',
    address: 'Kilimani, Wood Avenue, 2nd Floor Suite 14, Nairobi',
    phone: '+254722889900',
    whatsappNumber: '254722889900',
    currency: 'KES',
    currencySymbol: 'KSh',
    bannerImage: salonBraidsImg,
    avatarImage: salonBraidsImg,
    hours: 'Mon - Sun: 8:00 AM - 7:00 PM',
    isOpen: true,
    deliveryFee: 0,
    minimumOrder: 500,
    acceptsCashOnDelivery: false,
    acceptsMobileMoney: true,
    mobileMoneyName: 'M-Pesa Paybill',
    mobileMoneyNumber: '400200 (Acc: AMANI)',
    acceptsCard: true,
    rating: 4.95,
    reviewCount: 52,
    viewsCount: 890,
    whatsappClicks: 310,
    createdAt: '2026-09-01',
    items: [
      {
        id: 'item-knotless-medium',
        name: 'Mid-Back Knotless Box Braids',
        category: 'Braiding & Twists',
        description: 'Lightweight, featherlight knotless braids with neat parts. Braiding hair and scalp oil massage included.',
        price: 3500,
        image: salonBraidsImg,
        isAvailable: true,
        type: 'service',
        estimatedTime: '3.5 hrs',
        unit: 'full head'
      },
      {
        id: 'item-gel-manicure',
        name: 'Russian Cuticle Cleanse & Gel Polish',
        category: 'Nails & Pedicure',
        description: 'Precision cuticle treatment, strengthening base coat, and chip-free gel polish lasting up to 4 weeks.',
        price: 1800,
        image: salonBraidsImg,
        isAvailable: true,
        type: 'service',
        estimatedTime: '60 mins',
        unit: 'session'
      },
      {
        id: 'item-silk-press',
        name: 'Deep Conditioning & Ceramic Silk Press',
        category: 'Natural Hair Care',
        description: 'Steam protein hair mask, blow dry, and temperature-controlled silk press with high shine.',
        price: 2500,
        image: salonBraidsImg,
        isAvailable: true,
        type: 'service',
        estimatedTime: '2 hrs',
        unit: 'session'
      },
      {
        id: 'item-locs-retwist',
        name: 'Dreadlocks Wash, Retwist & Styling',
        category: 'Natural Hair Care',
        description: 'Organic peppermint shampoo detox, palm roll retwist, and custom barrel twist or basket weave styling.',
        price: 2200,
        image: salonBraidsImg,
        isAvailable: true,
        type: 'service',
        estimatedTime: '2 hrs',
        unit: 'session'
      }
    ]
  },
  {
    id: 'store-bakehouse-kisumu',
    slug: 'bakehouse-kisumu',
    name: 'BakeHouse Artisanal Pastries',
    tagline: 'Warm Cinnamon Rolls, Sourdough & Custom Treats',
    description: 'Baked fresh every sunrise using pure butter and unbleached grain. Pre-order your morning box or celebration cakes.',
    category: 'bakery',
    town: 'Kisumu',
    address: 'Milimani Estate, Ring Road opposite Golf Club, Kisumu',
    phone: '+254733112233',
    whatsappNumber: '254733112233',
    currency: 'KES',
    currencySymbol: 'KSh',
    bannerImage: bakeryPastriesImg,
    avatarImage: bakeryPastriesImg,
    hours: 'Tue - Sun: 7:30 AM - 6:00 PM',
    isOpen: true,
    deliveryFee: 150,
    minimumOrder: 400,
    acceptsCashOnDelivery: true,
    acceptsMobileMoney: true,
    mobileMoneyName: 'M-Pesa Till',
    mobileMoneyNumber: '741289',
    acceptsCard: true,
    rating: 4.88,
    reviewCount: 29,
    viewsCount: 520,
    whatsappClicks: 142,
    createdAt: '2026-09-20',
    items: [
      {
        id: 'item-cinnamon-box',
        name: 'Gooey Vanilla Cream Glazed Cinnamon Rolls (Box of 4)',
        category: 'Fresh Morning Bakes',
        description: 'Pillowy soft rolls layered with Korintje cinnamon brown sugar and topped with melted cream cheese icing.',
        price: 850,
        image: bakeryPastriesImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'Ready for pickup',
        unit: 'box of 4'
      },
      {
        id: 'item-sourdough',
        name: 'Country Artisan Sourdough Boule (850g)',
        category: 'Artisanal Breads',
        description: 'Naturally fermented for 36 hours. Blistered golden crust with open, chewy, airy crumb.',
        price: 450,
        image: bakeryPastriesImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'Fresh morning batch',
        unit: 'loaf'
      },
      {
        id: 'item-passion-tart',
        name: 'Passion Curd & White Chocolate Tart',
        category: 'Desserts',
        description: 'Crisp almond sablé tart shell filled with tangy local passion fruit curd and toasted Italian meringue.',
        price: 350,
        image: bakeryPastriesImg,
        isAvailable: true,
        type: 'product',
        estimatedTime: 'Ready',
        unit: 'slice'
      }
    ]
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-9101',
    storeId: 'store-mama-ochieng',
    customerName: 'Kiprono Cheruiyot',
    customerPhone: '+254721990011',
    items: [
      { itemId: 'item-pilau-plate', name: 'Swahili Spiced Beef Pilau Special', quantity: 2, price: 450 },
      { itemId: 'item-passion-juice', name: 'Cold-Pressed Fresh Passion Juice', quantity: 2, price: 150 }
    ],
    total: 1200,
    status: 'new' as const,
    orderType: 'delivery' as const,
    deliveryAddress: 'United Mall, 1st Floor Office 12, Kisumu',
    paymentMethod: 'mobile_money' as const,
    paymentStatus: 'paid' as const,
    notes: 'Please add extra kachumbari and lime!',
    createdAt: '12 minutes ago'
  },
  {
    id: 'ORD-9088',
    storeId: 'store-mama-ochieng',
    customerName: 'Faith Wanjiku',
    customerPhone: '+254710443322',
    items: [
      { itemId: 'item-fish-curry', name: 'Whole Tilapia with Coconut Samaki Sauce', quantity: 1, price: 650 },
      { itemId: 'item-samosa-trio', name: 'Crispy Beef Samosas (Pair of 3)', quantity: 1, price: 200 }
    ],
    total: 950,
    status: 'preparing' as const,
    orderType: 'pickup' as const,
    deliveryAddress: '',
    paymentMethod: 'cash_on_delivery' as const,
    paymentStatus: 'pending' as const,
    notes: 'Will pick up at 1:15 PM sharp.',
    createdAt: '34 minutes ago'
  },
  {
    id: 'ORD-9075',
    storeId: 'store-mama-ochieng',
    customerName: 'Brian Otieno',
    customerPhone: '+254733556677',
    items: [
      { itemId: 'item-pilau-plate', name: 'Swahili Spiced Beef Pilau Special', quantity: 3, price: 450 }
    ],
    total: 1450,
    status: 'ready' as const,
    orderType: 'delivery' as const,
    deliveryAddress: 'Milimani Doctors Plaza, Reception',
    paymentMethod: 'mobile_money' as const,
    paymentStatus: 'paid' as const,
    notes: '',
    createdAt: '1 hour ago'
  }
];
