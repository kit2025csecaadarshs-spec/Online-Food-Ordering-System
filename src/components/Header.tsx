import React, { useState } from 'react';
import { ShoppingBag, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  activeCategory: string;
  onSelectCategory: (catId: any) => void;
  onOpenFeatured3D: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  activeCategory,
  onSelectCategory,
  onOpenFeatured3D,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
    if (!next) soundFx.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-stone-200/80 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2 group font-display"
        >
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-bold shadow-xs group-hover:bg-amber-600 transition-colors">
            S3D
          </span>
          <span>Savor<span className="text-amber-600">3D</span></span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-stone-600">
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectCategory('all');
            }}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              activeCategory === 'all' ? 'text-amber-800 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectCategory('burgers');
            }}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              activeCategory === 'burgers' ? 'text-amber-800 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Burgers
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectCategory('pizzas');
            }}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              activeCategory === 'pizzas' ? 'text-amber-800 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Wood-Fired
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectCategory('bowls');
            }}
            className={`transition-colors whitespace-nowrap hover:text-stone-900 ${
              activeCategory === 'bowls' ? 'text-amber-800 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Poke Bowls
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenFeatured3D();
            }}
            className="flex items-center gap-1 text-amber-700 hover:text-amber-800 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D Kitchen Lab</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Sound Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Audio toggle button */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
            title={isMuted ? 'Turn on sound effects' : 'Mute sound effects'}
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenCart();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 rounded-xl hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-900 font-bold text-[11px] flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
