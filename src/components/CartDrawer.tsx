import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Check, Bike, Store } from 'lucide-react';
import { CartItem } from '../types/food';
import { soundFx } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: (fulfillmentType: 'delivery' | 'pickup', promoDiscount: number, promoCode: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.itemPrice * item.quantity, 0);

  // Delivery fee calculation ($3.50, free over $35 or if pickup)
  const isFreeDelivery = subtotal >= 35 || fulfillmentType === 'pickup';
  const deliveryFee = fulfillmentType === 'delivery' ? (isFreeDelivery ? 0 : 3.50) : 0;

  // Promo discount
  const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discountPercent) / 100 : 0;
  const tax = (subtotal - promoDiscount) * 0.0825; // 8.25%
  const total = Math.max(0, subtotal - promoDiscount + deliveryFee + tax);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const cleanCode = promoCodeInput.trim().toUpperCase();

    if (cleanCode === 'TASTY20') {
      soundFx.playAddToCart();
      setAppliedPromo({ code: 'TASTY20', discountPercent: 20 });
      setPromoCodeInput('');
    } else if (cleanCode === 'SAVOR10') {
      soundFx.playAddToCart();
      setAppliedPromo({ code: 'SAVOR10', discountPercent: 10 });
      setPromoCodeInput('');
    } else {
      setPromoError('Invalid code. Try "TASTY20" for 20% off!');
    }
  };

  const handleProceed = () => {
    soundFx.playClick();
    onCheckout(fulfillmentType, promoDiscount, appliedPromo?.code || '');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-stone-900">Your Order</h2>
            <span className="text-xs font-semibold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded-full">
              {items.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-stone-200/70 text-stone-500 hover:text-stone-900 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fulfillment Choice: Delivery or Pickup */}
        <div className="p-4 border-b border-stone-100 bg-white">
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl border border-stone-200/60">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setFulfillmentType('delivery');
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
                fulfillmentType === 'delivery'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bike className="w-4 h-4 text-amber-600" />
              <span>Delivery (25-35m)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setFulfillmentType('pickup');
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors ${
                fulfillmentType === 'pickup'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span>Pickup (15m)</span>
            </button>
          </div>

          {fulfillmentType === 'delivery' && (
            <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
              <span>{isFreeDelivery ? 'Free Delivery threshold unlocked!' : `Add $${(35 - subtotal).toFixed(2)} for free delivery`}</span>
              <span className="font-semibold text-amber-700">{isFreeDelivery ? '$0.00' : '$3.50'}</span>
            </div>
          )}
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-3">
                <ShoppingBag className="w-8 h-8 text-stone-400" />
              </div>
              <p className="text-sm font-semibold text-stone-700 mb-1">Your cart is empty</p>
              <p className="text-xs text-stone-500 max-w-xs mb-4">
                Explore our chef-curated artisanal menu and customize your dishes in 3D!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((cartItem) => (
              <div
                key={cartItem.cartItemId}
                className="p-3 bg-stone-50/80 rounded-xl border border-stone-200/70 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                      {cartItem.item.name}
                    </h4>
                    <span className="text-xs font-mono font-medium text-stone-600 tabular-nums">
                      ${cartItem.itemPrice.toFixed(2)} each
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onRemoveItem(cartItem.cartItemId);
                    }}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Selected Custom Options */}
                {cartItem.selectedOptions.length > 0 && (
                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    {cartItem.selectedOptions.map((opt) => (
                      <div key={opt.id} className="flex items-center justify-between">
                        <span>+ {opt.name}</span>
                        {opt.price > 0 && (
                          <span className="font-mono tabular-nums text-stone-600">
                            +${opt.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Kitchen notes */}
                {cartItem.specialInstructions && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 italic">
                    Note: {cartItem.specialInstructions}
                  </p>
                )}

                {/* Quantity Stepper & Row Total */}
                <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 mt-1">
                  <div className="flex items-center border border-stone-200 rounded-lg bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        onUpdateQuantity(cartItem.cartItemId, -1);
                      }}
                      className="p-1 rounded text-stone-500 hover:bg-stone-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-semibold text-xs text-stone-900 tabular-nums">
                      {cartItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        onUpdateQuantity(cartItem.cartItemId, 1);
                      }}
                      className="p-1 rounded text-stone-500 hover:bg-stone-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs font-bold font-mono text-stone-900 tabular-nums">
                    ${(cartItem.itemPrice * cartItem.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Section */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50/70 space-y-3">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo code (e.g. TASTY20)"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase placeholder:normal-case"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Apply
              </button>
            </form>

            {/* Promo confirmation or error */}
            {appliedPromo && (
              <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <span className="flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Code &quot;{appliedPromo.code}&quot; applied (-{appliedPromo.discountPercent}%)
                </span>
                <button
                  type="button"
                  onClick={() => setAppliedPromo(null)}
                  className="text-emerald-900 hover:underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}
            {promoError && (
              <p className="text-[11px] text-rose-600">{promoError}</p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedPromo.discountPercent}%)</span>
                  <span className="font-mono tabular-nums">-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{fulfillmentType === 'delivery' ? 'Estimated Delivery' : 'Store Pickup'}</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Total</span>
                <span className="font-mono tabular-nums text-amber-900 text-base">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={handleProceed}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
