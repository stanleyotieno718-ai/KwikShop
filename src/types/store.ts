export type StoreCategory = 'food' | 'salon' | 'bakery' | 'craft' | 'retail' | 'grocery';

export type PaymentMethod = 'mobile_money' | 'cash_on_delivery' | 'card';

export interface StoreItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  type: 'product' | 'service';
  estimatedTime?: string;
  unit?: string;
}

export interface StoreOrder {
  id: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  items: {
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  orderType: 'delivery' | 'pickup' | 'dine_in';
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  notes?: string;
  createdAt: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: StoreCategory;
  town: string;
  address: string;
  phone: string;
  whatsappNumber: string;
  currency: string;
  currencySymbol: string;
  bannerImage?: string;
  avatarImage?: string;
  hours: string;
  isOpen: boolean;
  deliveryFee: number;
  minimumOrder: number;
  acceptsCashOnDelivery: boolean;
  acceptsMobileMoney: boolean;
  mobileMoneyName: string; // e.g. "M-Pesa Till" or "MTN Mobile Money"
  mobileMoneyNumber: string; // e.g. "Till # 894321" or "+254712345678"
  acceptsCard: boolean;
  rating: number;
  reviewCount: number;
  items: StoreItem[];
  viewsCount: number;
  whatsappClicks: number;
  createdAt: string;
}

export interface FlyerTemplate {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  themeColor: string;
  bgGradient: string;
  promoCode?: string;
}
