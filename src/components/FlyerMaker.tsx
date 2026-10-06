import React, { useState, useRef, useEffect } from 'react';
import { Store } from '../types/store';
import { Download, Sparkles, Share2, Copy, Check, Palette, Tag } from 'lucide-react';
import { exportCanvasAsImage } from '../utils/canvasExport';

interface FlyerMakerProps {
  store: Store;
}

interface TemplateOption {
  id: string;
  name: string;
  headline: string;
  tagline: string;
  badge: string;
  theme: 'amber' | 'emerald' | 'sunset' | 'indigo';
}

const TEMPLATES: TemplateOption[] = [
  {
    id: 'weekend_special',
    name: 'Weekend Special',
    headline: 'Weekend Feast Deal',
    tagline: 'Order fresh and get fast delivery straight to your door!',
    badge: 'Limited Offer',
    theme: 'amber'
  },
  {
    id: 'daily_fresh',
    name: "Today's Specials",
    headline: 'Fresh From Our Kitchen',
    tagline: 'Authentic local taste made with care every single morning.',
    badge: 'Daily Favorite',
    theme: 'emerald'
  },
  {
    id: 'discount_flash',
    name: '10% Off Promo',
    headline: 'Flash Order Discount',
    tagline: 'Use code LOCAL10 on WhatsApp for 10% off your first order.',
    badge: 'Save 10%',
    theme: 'sunset'
  },
  {
    id: 'salon_booking',
    name: 'Book Your Session',
    headline: 'Pamper Yourself Today',
    tagline: 'Slots open for styling, treatments and natural hair care.',
    badge: 'Now Booking',
    theme: 'indigo'
  }
];

export const FlyerMaker: React.FC<FlyerMakerProps> = ({ store }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>(TEMPLATES[0]);
  const [headline, setHeadline] = useState(TEMPLATES[0].headline);
  const [tagline, setTagline] = useState(TEMPLATES[0].tagline);
  const [badgeText, setBadgeText] = useState(TEMPLATES[0].badge);
  const [featuredItem, setFeaturedItem] = useState(store.items[0]?.name || 'Special Menu Item');
  const [priceHighlight, setPriceHighlight] = useState(
    store.items[0] ? `${store.currencySymbol} ${store.items[0].price}` : 'Starting at KSh 250'
  );
  const [activeTheme, setActiveTheme] = useState<'amber' | 'emerald' | 'sunset' | 'indigo'>('amber');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const themeGradients = {
    amber: {
      bg: 'from-amber-600 via-orange-600 to-stone-900',
      accent: '#f59e0b',
      textAccent: 'text-amber-400',
      primaryBg: '#d97706',
      border: 'border-amber-500/30'
    },
    emerald: {
      bg: 'from-emerald-700 via-teal-800 to-stone-900',
      accent: '#10b981',
      textAccent: 'text-emerald-400',
      primaryBg: '#059669',
      border: 'border-emerald-500/30'
    },
    sunset: {
      bg: 'from-rose-600 via-orange-600 to-stone-900',
      accent: '#f43f5e',
      textAccent: 'text-rose-400',
      primaryBg: '#e11d48',
      border: 'border-rose-500/30'
    },
    indigo: {
      bg: 'from-indigo-700 via-purple-800 to-stone-900',
      accent: '#818cf8',
      textAccent: 'text-indigo-400',
      primaryBg: '#4f46e5',
      border: 'border-indigo-500/30'
    }
  };

  const handleSelectTemplate = (tmpl: TemplateOption) => {
    setSelectedTemplate(tmpl);
    setHeadline(tmpl.headline);
    setTagline(tmpl.tagline);
    setBadgeText(tmpl.badge);
    setActiveTheme(tmpl.theme);
  };

  // Render to canvas for crisp download
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 800 x 800 high resolution square
    canvas.width = 800;
    canvas.height = 800;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 800);
    if (activeTheme === 'amber') {
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#b45309');
      grad.addColorStop(1, '#1c1917');
    } else if (activeTheme === 'emerald') {
      grad.addColorStop(0, '#047857');
      grad.addColorStop(0.5, '#065f46');
      grad.addColorStop(1, '#1c1917');
    } else if (activeTheme === 'sunset') {
      grad.addColorStop(0, '#e11d48');
      grad.addColorStop(0.5, '#c2410c');
      grad.addColorStop(1, '#1c1917');
    } else {
      grad.addColorStop(0, '#4338ca');
      grad.addColorStop(0.5, '#5b21b6');
      grad.addColorStop(1, '#1c1917');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 800);

    // Decorative geometric ring
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(700, 100, 240, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(100, 750, 180, 0, Math.PI * 2);
    ctx.stroke();

    // Top brand bar
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(store.name.toUpperCase(), 60, 90);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '16px sans-serif';
    ctx.fillText(`📍 ${store.town} · Verified Local Business`, 60, 120);

    // Badge pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.roundRect(60, 160, 180, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(badgeText.toUpperCase(), 80, 184);

    // Headline
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(headline, 60, 260);

    // Tagline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '22px sans-serif';
    // basic wrap
    ctx.fillText(tagline.slice(0, 50), 60, 310);
    if (tagline.length > 50) {
      ctx.fillText(tagline.slice(50, 100), 60, 340);
    }

    // Featured Item Card in center
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.roundRect(60, 380, 680, 190, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(featuredItem, 90, 440);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(priceHighlight, 90, 495);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px sans-serif';
    ctx.fillText(`Tap to order directly on WhatsApp with instant response!`, 90, 535);

    // Call To Action Footer Bar
    ctx.fillStyle = '#22c55e'; // WhatsApp green
    ctx.beginPath();
    ctx.roundRect(60, 620, 680, 90, 14);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`💬 ORDER VIA WHATSAPP: ${store.phone}`, 90, 675);

    // Tiny bottom stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Powered by KwikShop · Fast Delivery & Local Ordering`, 60, 755);
  };

  useEffect(() => {
    renderCanvas();
  }, [headline, tagline, badgeText, featuredItem, priceHighlight, activeTheme]);

  const handleDownloadFlyer = () => {
    if (canvasRef.current) {
      exportCanvasAsImage(canvasRef.current, `${store.slug}-promo-flyer.png`);
    }
  };

  const socialCaption = `🔥 ${headline} at ${store.name}!

✨ ${featuredItem} - only ${priceHighlight}!
${tagline}

🛵 Fast ordering & delivery in ${store.town}!
👉 Tap our link or message us on WhatsApp to order:
https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}

#${store.town} #${store.category} #KwikShop #SupportLocal`;

  const copyCaptionToClipboard = () => {
    navigator.clipboard.writeText(socialCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Promo & Flyer Studio
          </h3>
          <p className="text-sm text-stone-500 mt-1">
            Create professional marketing graphics for WhatsApp Status, Instagram, and Facebook in 30 seconds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={copyCaptionToClipboard}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCaption ? 'Caption Copied!' : 'Copy Social Caption'}
          </button>
          <button
            onClick={handleDownloadFlyer}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Flyer (PNG)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        {/* Left: Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Preset templates */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              1. Choose Promo Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                    selectedTemplate.id === tmpl.id
                      ? 'border-emerald-500 bg-emerald-50/50 text-stone-900 font-semibold ring-1 ring-emerald-500'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <p className="truncate">{tmpl.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-500" />
              2. Color Palette
            </label>
            <div className="flex items-center gap-2">
              {(['amber', 'emerald', 'sunset', 'indigo'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => setActiveTheme(theme)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium border transition-all ${
                    activeTheme === theme
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Text customization */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Badge Text</label>
              <input
                type="text"
                value={badgeText}
                onChange={e => setBadgeText(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={e => setHeadline(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Tagline / Details</label>
              <textarea
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                rows={2}
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Featured Item</label>
                <input
                  type="text"
                  value={featuredItem}
                  onChange={e => setFeaturedItem(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Price Highlight</label>
                <input
                  type="text"
                  value={priceHighlight}
                  onChange={e => setPriceHighlight(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Flyer Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-stone-100/70 p-6 rounded-xl border border-stone-200">
          <div
            className={`w-full max-w-sm aspect-square rounded-2xl p-6 text-white bg-gradient-to-br ${
              themeGradients[activeTheme].bg
            } shadow-xl flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Subtle glow circle */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top brand */}
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base tracking-wide text-white drop-shadow-sm">{store.name}</h4>
                  <p className="text-xs text-white/70">{store.town} · Verified Local Merchant</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                  {badgeText}
                </span>
              </div>

              <div className="mt-4">
                <h2 className="text-2xl font-black leading-tight text-white">{headline}</h2>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">{tagline}</p>
              </div>
            </div>

            {/* Middle card */}
            <div className="my-auto bg-black/30 backdrop-blur-md rounded-xl p-3.5 border border-white/15 relative z-10">
              <p className="text-xs font-semibold text-white truncate">{featuredItem}</p>
              <p className="text-xl font-bold font-mono text-amber-300 mt-0.5">{priceHighlight}</p>
              <p className="text-[10px] text-white/70 mt-1">Direct delivery or pickup in {store.town}</p>
            </div>

            {/* Bottom action */}
            <div className="relative z-10 pt-2">
              <div className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 font-semibold text-xs shadow-md">
                <span>💬 Order on WhatsApp: {store.phone}</span>
              </div>
              <p className="text-[9px] text-center text-white/50 mt-2">KwikShop · Tap link to view full menu</p>
            </div>
          </div>

          {/* Hidden Canvas used for high-res PNG export */}
          <canvas ref={canvasRef} className="hidden" />

          <p className="text-xs text-stone-500 mt-4 text-center">
            Square 1:1 format — Perfect for WhatsApp Status, Instagram Feed & Facebook Posts.
          </p>
        </div>
      </div>
    </div>
  );
};
