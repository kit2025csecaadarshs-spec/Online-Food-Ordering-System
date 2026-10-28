import React from 'react';
import { Plus, Eye, Clock, Flame, Star } from 'lucide-react';
import { MenuItem } from '../types/food';
import { soundFx } from '../utils/audio';

interface DishCardProps {
  item: MenuItem;
  onInspect: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ item, onInspect, onQuickAdd }) => {
  // Category-specific visual theme background
  const getGradientForModel = (model: MenuItem['modelType']) => {
    switch (model) {
      case 'burger':
        return 'from-amber-100/60 via-amber-50/40 to-stone-50';
      case 'pizza':
        return 'from-orange-100/60 via-rose-50/40 to-stone-50';
      case 'bowl':
        return 'from-emerald-100/60 via-teal-50/40 to-stone-50';
      case 'boba':
        return 'from-lime-100/60 via-green-50/40 to-stone-50';
      case 'taco':
        return 'from-yellow-100/60 via-amber-50/40 to-stone-50';
      default:
        return 'from-stone-100 to-stone-50';
    }
  };

  const getEmojiIcon = (model: MenuItem['modelType']) => {
    switch (model) {
      case 'burger':
        return '🍔';
      case 'pizza':
        return '🍕';
      case 'bowl':
        return '🥗';
      case 'boba':
        return '🧋';
      case 'taco':
        return '🌮';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 hover:border-amber-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Visual Showcase / 3D Teaser Canvas */}
        <div
          onClick={() => onInspect(item)}
          className={`relative h-48 bg-gradient-to-b ${getGradientForModel(
            item.modelType
          )} flex items-center justify-center cursor-pointer overflow-hidden p-4`}
        >
          {/* Subtle concentric circles background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-36 h-36 rounded-full border border-stone-300/60" />
            <div className="absolute w-24 h-24 rounded-full border border-stone-300/40" />
          </div>

          {/* Dish Visual Emblem */}
          <div className="relative text-center transform transition-transform duration-300 group-hover:scale-105">
            <span className="text-6xl drop-shadow-md select-none">{getEmojiIcon(item.modelType)}</span>
            <div className="mt-2 text-[11px] font-semibold tracking-wider uppercase text-stone-600 bg-white/80 border border-stone-200/60 rounded-md px-2 py-0.5 shadow-2xs backdrop-blur-xs flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-amber-600" />
              <span>Click for 3D Studio</span>
            </div>
          </div>

          {/* Badge */}
          {item.badge && (
            <div className="absolute top-3 left-3 bg-white/95 border border-stone-200/90 text-stone-800 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
              {item.badge}
            </div>
          )}

          {/* Quick 3D Pill button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playClick();
              onInspect(item);
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/95 border border-stone-200 text-stone-600 hover:text-stone-900 shadow-2xs hover:bg-stone-50 transition-colors"
            title="Inspect 3D layers and customize"
          >
            <Eye className="w-4 h-4 text-amber-700" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Unboxed Metadata Line with separators */}
          <div className="flex items-center gap-2 text-xs text-stone-600 mb-1.5">
            <span className="flex items-center gap-1 font-medium text-stone-700">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {item.rating} ({item.reviewCount})
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-600" />
              {item.prepTimeMinutes}m
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" />
              {item.calories} cal
            </span>
          </div>

          <h3
            onClick={() => onInspect(item)}
            className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer leading-snug"
          >
            {item.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>

          {/* Key ingredients teaser */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.ingredients.slice(0, 3).map((ing, i) => (
              <span
                key={i}
                className="text-[11px] text-stone-600 bg-stone-100/90 rounded px-1.5 py-0.5 border border-stone-200/50"
              >
                {ing.split(' ')[0]} {ing.split(' ')[1] || ''}
              </span>
            ))}
            {item.ingredients.length > 3 && (
              <span className="text-[11px] text-stone-600 px-1 py-0.5">
                +{item.ingredients.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Price & Actions */}
      <div className="p-4 sm:px-5 sm:pb-5 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
        <div>
          <span className="text-[11px] text-stone-600 block">Starting at</span>
          <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onInspect(item);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors border border-stone-200/60"
          >
            Customize
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playAddToCart();
              onQuickAdd(item);
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs flex items-center gap-1"
            title="Quick add to cart"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
