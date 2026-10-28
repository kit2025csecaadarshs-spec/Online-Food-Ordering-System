import React from 'react';
import { Sparkles, ArrowDown, ShoppingBag } from 'lucide-react';
import { FoodViewer3D } from './three/FoodViewer3D';
import { MenuItem } from '../types/food';
import { soundFx } from '../utils/audio';

interface HeroSectionProps {
  featuredItem: MenuItem;
  onInspect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
  onScrollToMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredItem,
  onInspect,
  onQuickAdd,
  onScrollToMenu,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] to-[#FAFAF9] border-b border-stone-200/80 pt-8 pb-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial & Call to Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              {/* Editorial Kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Next-Gen Online Kitchen</span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-500 font-normal">Three.js Interactive Studio</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] text-balance font-display">
                Crafted by master chefs. <br />
                <span className="text-amber-800">Inspected in 3D.</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
                Experience dining before you order. Rotate, explode, and customize every artisanal dish layer-by-layer in real-time 3D, prepared fresh with pasture-raised ingredients and delivered straight to your door.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onInspect(featuredItem);
                }}
                className="px-5 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Customize in 3D (${featuredItem.price.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playAddToCart();
                  onQuickAdd(featuredItem);
                }}
                className="px-4 py-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-colors flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-stone-500" />
                <span>Quick Add</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onScrollToMenu();
                }}
                className="px-4 py-3 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>View Menu</span>
                <ArrowDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>

            {/* Unboxed Proof / Trust Strip */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-stone-500">
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <span className="text-amber-500">★ 4.9</span>
                <span>Average Rating</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <span>⏱ 25–35 Min</span>
                <span>Express Delivery</span>
              </div>
              <span aria-hidden="true" className="text-stone-300">/</span>
              <div className="flex items-center gap-1.5 font-medium text-stone-700">
                <span>🌱 100% Organic</span>
                <span>Pasture-Raised</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero 3D Interactive Dish Stage */}
          <div className="lg:col-span-6 relative">
            <div className="relative bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-2 sm:p-4">
              <div className="h-[360px] sm:h-[440px] w-full relative rounded-2xl overflow-hidden bg-[#FAFAF9]">
                <FoodViewer3D
                  modelType={featuredItem.modelType}
                  activeToppings={['extraCheese']}
                  autoRotateDefault={true}
                  className="w-full h-full"
                  showControls={true}
                />
              </div>

              {/* Bottom Caption Pill in Hero */}
              <div className="mt-3 px-2 flex items-center justify-between text-xs text-stone-600">
                <div>
                  <span className="font-bold text-stone-900 block">{featuredItem.name}</span>
                  <span className="text-[11px] text-stone-500">{featuredItem.tagline}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onInspect(featuredItem)}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                >
                  Full 3D Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
