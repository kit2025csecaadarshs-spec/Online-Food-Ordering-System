import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, ChefHat, Bike, Home, Phone, Share2, RefreshCw } from 'lucide-react';
import { Order } from '../types/food';
import { soundFx } from '../utils/audio';

interface OrderTrackerModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderAgain: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderAgain,
}) => {
  if (!isOpen || !order) return null;

  // Stages: 0 = received, 1 = prepping, 2 = on_the_way, 3 = delivered
  const [currentStage, setCurrentStage] = useState<number>(() => {
    switch (order.status) {
      case 'received': return 0;
      case 'prepping': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  });

  const [etaMinutes, setEtaMinutes] = useState<number>(order.estimatedArrivalMinutes);

  // Auto-advance stages simulation after few seconds or via button
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaMinutes((prev) => Math.max(1, prev - 1));
    }, 15000); // decrement eta periodically
    return () => clearInterval(timer);
  }, []);

  const advanceStage = () => {
    soundFx.playClick();
    setCurrentStage((prev) => {
      const next = Math.min(3, prev + 1);
      if (next === 3) soundFx.playOrderSuccess();
      return next;
    });
  };

  const stages = [
    { label: 'Order Confirmed', icon: CheckCircle2, desc: 'Kitchen acknowledged ticket' },
    { label: 'Chef Preparing', icon: ChefHat, desc: 'Cooking fresh ingredients' },
    { label: 'Out for Delivery', icon: Bike, desc: 'Courier Alex on high-speed E-bike' },
    { label: 'Arrived & Delivered', icon: Home, desc: 'Enjoy your meal!' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                #{order.id}
              </span>
              <span className="text-xs text-stone-500">Placed at {order.createdAt}</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-0.5">
              Live Order Tracker
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Estimated Delivery Time Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-900 uppercase tracking-wider block">
                {currentStage === 3 ? 'Delivered Successfully' : 'Estimated Arrival'}
              </span>
              <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                {currentStage === 3 ? 'Arrived!' : `${etaMinutes} Minutes`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-500 block">Deliver To</span>
              <span className="text-xs font-semibold text-stone-800 line-clamp-1 max-w-[200px]">
                {order.deliveryAddress}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <div className="relative flex items-center justify-between">
              {/* Connecting line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-stone-200 -z-0">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
                />
              </div>

              {/* Milestones */}
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isPassed = idx <= currentStage;
                const isCurrent = idx === currentStage;

                return (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isPassed
                          ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                          : 'bg-white border-stone-300 text-stone-400'
                      } ${isCurrent ? 'ring-4 ring-amber-100' : ''}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-2 text-center max-w-[80px] leading-tight ${
                        isPassed ? 'text-stone-900' : 'text-stone-400'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Current Stage Detailed Description */}
            <div className="mt-4 p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-center">
              <p className="text-xs font-semibold text-stone-800">
                Status: {stages[currentStage].label}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                {stages[currentStage].desc}
              </p>
            </div>
          </div>

          {/* Courier Card (when out for delivery or prepping) */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-sm">
                AR
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Alex Rivers</h4>
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span>Courier (4.95 ★)</span>
                  <span aria-hidden="true">·</span>
                  <span>E-Bike #42</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  alert('Connecting with Alex via secure in-app phone proxy...');
                }}
                className="p-2 bg-white border border-stone-200 rounded-xl text-stone-700 hover:text-stone-900 shadow-2xs hover:bg-stone-100 transition-colors"
                title="Call Courier"
              >
                <Phone className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </div>

          {/* Order Items Receipt Summary */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
              Order Receipt
            </h4>
            <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 bg-white">
              {order.items.map((cartItem) => (
                <div key={cartItem.cartItemId} className="p-3 text-xs flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-stone-900">
                      {cartItem.quantity}x {cartItem.item.name}
                    </span>
                    {cartItem.selectedOptions.length > 0 && (
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {cartItem.selectedOptions.map((o) => o.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-medium text-stone-800 tabular-nums">
                    ${(cartItem.itemPrice * cartItem.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="p-3 bg-stone-50/70 text-xs flex justify-between font-bold text-stone-900">
                <span>Total Paid</span>
                <span className="font-mono text-amber-900 tabular-nums">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          {/* Prototype Simulation helper button */}
          <button
            type="button"
            onClick={advanceStage}
            disabled={currentStage >= 3}
            className="px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-100/90 hover:bg-amber-200/90 disabled:opacity-40 rounded-xl transition-colors flex items-center gap-1.5"
            title="Simulate advancing to next order status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Next Stage</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onOrderAgain();
            }}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Order Something Else
          </button>
        </div>
      </div>
    </div>
  );
};
