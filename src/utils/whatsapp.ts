import { Store, StoreOrder } from '../types/store';

export function createWhatsAppOrderLink(
  store: Store,
  customerName: string,
  customerPhone: string,
  cartItems: { name: string; quantity: number; price: number }[],
  orderType: 'delivery' | 'pickup' | 'dine_in',
  deliveryAddress: string,
  paymentMethod: string,
  notes: string
): string {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = orderType === 'delivery' ? store.deliveryFee : 0;
  const total = subtotal + delivery;

  const itemsList = cartItems
    .map(i => `• ${i.quantity}x ${i.name} - ${store.currencySymbol} ${(i.price * i.quantity).toLocaleString()}`)
    .join('\n');

  const paymentLabel =
    paymentMethod === 'mobile_money'
      ? `Mobile Money (${store.mobileMoneyName || 'M-Pesa'})`
      : paymentMethod === 'cash_on_delivery'
      ? 'Cash on Delivery / Pickup'
      : 'Card Payment';

  const orderTypeText =
    orderType === 'delivery'
      ? `🛵 Delivery to: ${deliveryAddress || 'Standard Address'}`
      : orderType === 'pickup'
      ? '🛍️ Self Pickup at Store'
      : '🍽️ Dine-in';

  const text = `*New Order for ${store.name}* 🛒

${itemsList}

*Subtotal:* ${store.currencySymbol} ${subtotal.toLocaleString()}
${orderType === 'delivery' ? `*Delivery Fee:* ${store.currencySymbol} ${delivery.toLocaleString()}\n` : ''}*Total Amount:* *${store.currencySymbol} ${total.toLocaleString()}*

${orderTypeText}
*Customer:* ${customerName} (${customerPhone})
*Payment Method:* ${paymentLabel}
${notes ? `*Notes:* ${notes}\n` : ''}
Sent via KwikShop Storefront Link ⚡`;

  const cleanPhone = store.whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function createWhatsAppShareLink(store: Store, storeUrl: string): string {
  const text = `👋 Hello! Explore our online catalog & place your order in 30 seconds:

🛍️ *${store.name}*
📍 ${store.town} · ${store.tagline}

👉 View live catalog & prices here:
${storeUrl}

Order directly via WhatsApp!`;

  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function createOrderStatusUpdateWhatsApp(
  order: StoreOrder,
  store: Store,
  statusText: string
): string {
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  const text = `Hello ${order.customerName}! 👋

Update on your order *#${order.id}* from *${store.name}*:

📌 *Status: ${statusText}*
💰 Total: ${store.currencySymbol} ${order.total.toLocaleString()}

${statusText.includes('Delivery') ? 'Our rider is on the way to your location!' : 'We are preparing your items fresh!'}
Thank you for supporting our business!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function createReviewRequestWhatsApp(
  customerName: string,
  customerPhone: string,
  store: Store
): string {
  const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
  const text = `Hi ${customerName}! 👋 
Thank you for shopping with *${store.name}*!

We would love to hear your feedback. Did you enjoy your order?
Rating: ⭐⭐⭐⭐⭐

Reply here to let us know or share any suggestions!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
