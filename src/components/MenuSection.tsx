import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { MenuItem, FoodCategory, DietaryTag } from '../types/food';
import { CATEGORIES, DIETARY_FILTERS } from '../data/menuData';
import { DishCard } from './DishCard';
import { soundFx } from '../utils/audio';

interface MenuSectionProps {
  items: MenuItem[];
  selectedCategory: FoodCategory;
  onSelectCategory: (cat: FoodCategory) => void;
  onInspectDish: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
  onInspectDish,
  onQuickAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryTag>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'prepTime' | 'priceAsc' | 'priceDesc'>('recommended');

  // Filter & Sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        // Dietary filter
        if (dietaryFilter !== 'all' && !item.dietary.includes(dietaryFilter)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchIng = item.ingredients.some((ing) => ing.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchIng) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'prepTime') return a.prepTimeMinutes - b.prepTimeMinutes;
        if (sortBy === 'priceAsc') return a.price - b.price;
        if (sortBy === 'priceDesc') return b.price - a.price;
        return 0; // recommended order
      });
  }, [items, selectedCategory, dietaryFilter, searchQuery, sortBy]);

  return (
    <section id="menu-section" className="py-12 bg-[#FAFAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Kitchen Menu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
              Curated Artisanal Dishes
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select any item to inspect its ingredients in 3D or customize your toppings in real-time.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => {
                  soundFx.playClick();
                  setSortBy(e.target.value as any);
                }}
                className="text-xs font-medium text-stone-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="prepTime">Fastest Prep</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs (Segmented Control) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                onSelectCategory(cat.id);
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all shadow-2xs ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary Preference Filter Pills (Interactive Filter Controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mr-2 hidden sm:inline">
            Dietary:
          </span>
          {DIETARY_FILTERS.map((df) => (
            <button
              key={df.id}
              onClick={() => {
                soundFx.playClick();
                setDietaryFilter(df.id);
              }}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                dietaryFilter === df.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 border border-transparent'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-6">
            <p className="text-base font-bold text-stone-800 mb-1">No dishes found</p>
            <p className="text-xs text-stone-500 mb-4">
              We couldn&apos;t find any items matching &quot;{searchQuery}&quot;. Try resetting your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDietaryFilter('all');
                onSelectCategory('all');
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <DishCard
                key={item.id}
                item={item}
                onInspect={onInspectDish}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
