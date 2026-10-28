import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles, Clock, Flame, ShieldAlert } from 'lucide-react';
import { MenuItem, CustomOption } from '../types/food';
import { FoodViewer3D } from './three/FoodViewer3D';
import { soundFx } from '../utils/audio';

interface Dish3DModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, selectedOptions: CustomOption[], instructions: string) => void;
}

export const Dish3DModal: React.FC<Dish3DModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !item) return null;

  // Initialize selected options with defaults
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(() => {
    return item.customOptions.filter((opt) => opt.defaultSelected).map((opt) => opt.id);
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'customize' | 'nutrition' | 'ingredients'>('customize');

  // Toggle custom option
  const toggleOption = (optId: string) => {
    soundFx.playClick();
    setSelectedOptionIds((prev) =>
      prev.includes(optId) ? prev.filter((id) => id !== optId) : [...prev, optId]
    );
  };

  // Derive active toppings for 3D model
  const activeToppings = item.customOptions
    .filter((opt) => selectedOptionIds.includes(opt.id) && opt.threeLayerKey)
    .map((opt) => opt.threeLayerKey as string);

  // Calculate dynamic price
  const extraTotal = item.customOptions
    .filter((opt) => selectedOptionIds.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0);

  const unitPrice = item.price + extraTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const selectedOptionsList = item.customOptions.filter((opt) => selectedOptionIds.includes(opt.id));
    soundFx.playAddToCart();
    onAddToCart(item, quantity, selectedOptionsList, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col lg:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 border border-stone-200/80 text-stone-500 hover:text-stone-900 hover:bg-white shadow-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: 3D Studio Viewport */}
        <div className="lg:w-7/12 relative bg-[#FAFAF9] border-b lg:border-b-0 lg:border-r border-stone-200/80 flex flex-col h-[340px] sm:h-[420px] lg:h-auto min-h-[340px]">
          <FoodViewer3D
            modelType={item.modelType}
            activeToppings={activeToppings}
            autoRotateDefault={true}
            className="w-full h-full"
            showControls={true}
          />
        </div>

        {/* Right Side: Dish Details & Customization */}
        <div className="lg:w-5/12 flex flex-col justify-between overflow-y-auto p-5 sm:p-6 bg-white">
          <div>
            {/* Header info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-xs text-stone-600 mb-1">
                <span className="font-semibold text-amber-700 tracking-wide uppercase">{item.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-600" />
                  {item.prepTimeMinutes} mins
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  {item.calories} kcal
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-stone-700 font-medium">★ {item.rating} ({item.reviewCount})</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                {item.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Segmented Control Tabs */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl mb-4 border border-stone-200/60">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('customize');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'customize'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Customize Dish
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('ingredients');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'ingredients'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Ingredients
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('nutrition');
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'nutrition'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Nutrition
              </button>
            </div>

            {/* Tab 1: Customize */}
            {activeTab === 'customize' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                      Interactive Add-Ons (Updates 3D View)
                    </span>
                    <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live 3D Response
                    </span>
                  </div>

                  <div className="space-y-2">
                    {item.customOptions.map((opt) => {
                      const isSelected = selectedOptionIds.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleOption(opt.id)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-amber-50/70 border-amber-300 text-stone-900'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? 'bg-amber-600 border-amber-600 text-white'
                                  : 'border-stone-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-medium">{opt.name}</span>
                          </div>
                          <span className="text-xs font-mono font-medium text-stone-600 tabular-nums">
                            {opt.price === 0 ? 'Free' : `+$${opt.price.toFixed(2)}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label htmlFor="special-notes" className="block text-xs font-semibold text-stone-800 mb-1">
                    Kitchen Notes (Optional)
                  </label>
                  <input
                    id="special-notes"
                    type="text"
                    placeholder="e.g. Extra sauce on side, dressing separate..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-800 placeholder-stone-600"
                  />
                </div>
              </div>
            )}

            {/* Tab 2: Ingredients */}
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                    Fresh Farm Ingredients
                  </h4>
                  <ul className="space-y-1.5">
                    {item.ingredients.map((ing, idx) => (
                      <li key={idx} className="text-xs text-stone-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 mb-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>Allergen Notice</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Contains: {item.allergens.join(', ')}. Prepared in an artisanal kitchen where allergens are handled.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Nutrition */}
            {activeTab === 'nutrition' && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                  Macro Nutrient Profile (Per Serving)
                </h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-center">
                    <span className="block text-xs text-stone-600">Protein</span>
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {item.nutrition.protein}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-center">
                    <span className="block text-xs text-stone-600">Carbohydrates</span>
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {item.nutrition.carbs}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-center">
                    <span className="block text-xs text-stone-600">Dietary Fat</span>
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {item.nutrition.fat}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl text-center">
                    <span className="block text-xs text-stone-600">Fiber</span>
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {item.nutrition.fiber}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 italic">
                  Calorie count based on standard kitchen prep: {item.calories} calories total.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Bottom Purchase Actions */}
          <div className="pt-4 mt-4 border-t border-stone-200 flex items-center gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setQuantity((q) => Math.max(1, q - 1));
                }}
                disabled={quantity <= 1}
                className="p-1.5 rounded-lg text-stone-600 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-mono font-semibold text-xs text-stone-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setQuantity((q) => q + 1);
                }}
                className="p-1.5 rounded-lg text-stone-600 hover:bg-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-colors flex items-center justify-between"
            >
              <span>Add to Order</span>
              <span className="font-mono tabular-nums">${totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
