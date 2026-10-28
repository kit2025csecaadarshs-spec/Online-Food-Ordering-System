import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { Dish3DModal } from './components/Dish3DModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Footer } from './components/Footer';
import { MENU_ITEMS } from './data/menuData';
import { MenuItem, CartItem, CustomOption, Order, FoodCategory } from './types/food';
import { soundFx } from './utils/audio';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    // Restore from localStorage if available
    try {
      const saved = localStorage.getItem('savor3d_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [inspectingItem, setInspectingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [checkoutConfig, setCheckoutConfig] = useState<{
    fulfillmentType: 'delivery' | 'pickup';
    promoDiscount: number;
    promoCode: string;
  }>({
    fulfillmentType: 'delivery',
    promoDiscount: 0,
    promoCode: '',
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savor3d_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Add customized item from 3D modal
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedOptions: CustomOption[],
    specialInstructions: string
  ) => {
    const extraPrice = selectedOptions.reduce((s, o) => s + o.price, 0);
    const itemPrice = item.price + extraPrice;
    const optionKey = selectedOptions.map((o) => o.id).sort().join('_');
    const cartItemId = `${item.id}-${optionKey}-${specialInstructions || 'none'}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          item,
          quantity,
          selectedOptions,
          itemPrice,
          specialInstructions,
        },
      ];
    });

    showToast(`Added ${quantity}x ${item.name} to cart`);
  };

  // Quick add default configuration from card
  const handleQuickAdd = (item: MenuItem) => {
    const defaultOptions = item.customOptions.filter((o) => o.defaultSelected);
    handleAddToCart(item, 1, defaultOptions, '');
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQ = item.quantity + delta;
            return newQ > 0 ? { ...item, quantity: newQ } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const handleStartCheckout = (
    fulfillmentType: 'delivery' | 'pickup',
    promoDiscount: number,
    promoCode: string
  ) => {
    setCheckoutConfig({ fulfillmentType, promoDiscount, promoCode });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setActiveOrder(order);
    setIsCheckoutOpen(false);
    setIsOrderTrackerOpen(true);
    setCartItems([]);
    showToast(`Order #${order.id} placed! Kitchen is preparing.`);
  };

  const handleScrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((s, i) => s + i.itemPrice * i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col text-stone-900 selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          handleScrollToMenu();
        }}
        onOpenFeatured3D={() => setInspectingItem(MENU_ITEMS[0])}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-stone-800 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-4 h-4 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section with Interactive 3D Featured Dish Showcase */}
      <HeroSection
        featuredItem={MENU_ITEMS[0]}
        onInspect={(item) => setInspectingItem(item)}
        onQuickAdd={handleQuickAdd}
        onScrollToMenu={handleScrollToMenu}
      />

      {/* Main Menu Section with Category Tabs, Search, and Dish Grid */}
      <main className="flex-1">
        <MenuSection
          items={MENU_ITEMS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onInspectDish={(item) => setInspectingItem(item)}
          onQuickAdd={handleQuickAdd}
        />
      </main>

      {/* Active Order Tracker Floating Pill (if order in flight) */}
      {activeOrder && !isOrderTrackerOpen && (
        <div className="fixed bottom-5 right-5 z-30">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsOrderTrackerOpen(true);
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-2xl shadow-xl border border-amber-400 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Track Order #{activeOrder.id}</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* 3D Dish Detail & Customization Modal */}
      <Dish3DModal
        item={inspectingItem}
        isOpen={Boolean(inspectingItem)}
        onClose={() => setInspectingItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleStartCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        deliveryFee={checkoutConfig.fulfillmentType === 'delivery' ? (cartSubtotal >= 35 ? 0 : 3.50) : 0}
        promoDiscount={checkoutConfig.promoDiscount}
        fulfillmentType={checkoutConfig.fulfillmentType}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        order={activeOrder}
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
        onOrderAgain={() => {
          setIsOrderTrackerOpen(false);
          handleScrollToMenu();
        }}
      />
    </div>
  );
}
