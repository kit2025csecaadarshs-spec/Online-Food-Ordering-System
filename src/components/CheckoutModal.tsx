import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Smartphone, ShieldCheck, MapPin, Phone, User, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types/food';
import { soundFx } from '../utils/audio';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  promoDiscount: number;
  fulfillmentType: 'delivery' | 'pickup';
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  deliveryFee,
  promoDiscount,
  fulfillmentType,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('Elena Vance');
  const [phone, setPhone] = useState('+1 (555) 234-8971');
  const [address, setAddress] = useState('452 Hudson Street, Apt 3B, New York, NY');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('389');

  const tax = (subtotal - promoDiscount) * 0.0825;
  const total = Math.max(0, subtotal - promoDiscount + deliveryFee + tax);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Play fanfare and trigger celebratory confetti
    soundFx.playOrderSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EF4444'],
      });
    } catch {
      // Ignore if canvas blocked
    }

    const orderId = `SVR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      subtotal,
      deliveryFee,
      discount: promoDiscount,
      total,
      deliveryAddress: fulfillmentType === 'delivery' ? address : 'Kitchen Counter Pickup - 120 Mercer St',
      customerName: name,
      customerPhone: phone,
      paymentMethod,
      status: 'received',
      estimatedArrivalMinutes: fulfillmentType === 'delivery' ? 28 : 15,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition-colors mr-1"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Checkout & Payment
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-500 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Section 1: Customer & Fulfillment Information */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
              1. Customer & {fulfillmentType === 'delivery' ? 'Delivery Details' : 'Pickup Info'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {fulfillmentType === 'delivery' ? (
              <div className="mt-3">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Delivery Address & Apartment / Suite
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600">
                <span className="font-semibold text-stone-900 block mb-0.5">Pickup Location:</span>
                Savor3D Flagship Kitchen · 120 Mercer St, SoHo, NY (Ready in ~15 mins)
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3">
              2. Select Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setPaymentMethod('card');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-stone-700" />
                <span className="text-xs font-medium">Card</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setPaymentMethod('apple_pay');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  paymentMethod === 'apple_pay'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                }`}
              >
                <Smartphone className="w-5 h-5 text-stone-700" />
                <span className="text-xs font-medium">Apple Pay</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setPaymentMethod('cod');
                }}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-2xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                }`}
              >
                <DollarSign className="w-5 h-5 text-stone-700" />
                <span className="text-xs font-medium">Cash On Delivery</span>
              </button>
            </div>

            {/* Payment Fields (Card) */}
            {paymentMethod === 'card' && (
              <div className="mt-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-xs text-stone-600">
                Biometric Apple Pay authentication will trigger upon confirming order.
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xl text-center text-xs text-stone-600">
                Please have exact cash ready ($<span className="font-mono font-bold">{total.toFixed(2)}</span>) for the courier at delivery.
              </div>
            )}
          </div>

          {/* Section 3: Order Summary Table */}
          <div className="pt-2 border-t border-stone-200 text-xs space-y-1.5 text-stone-600">
            <div className="flex justify-between">
              <span>Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Promotional Savings</span>
                <span className="font-mono tabular-nums">-${promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-mono tabular-nums">
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Charge</span>
              <span className="font-mono tabular-nums text-amber-900">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Security Guarantee Notice */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit encrypted checkout · 100% Satisfaction Guarantee</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Confirming Order...</span>
            ) : (
              <span>Place Order · ${total.toFixed(2)}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
