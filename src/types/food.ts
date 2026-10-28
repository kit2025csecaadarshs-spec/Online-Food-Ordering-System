export type FoodCategory = 'all' | 'burgers' | 'pizzas' | 'bowls' | 'tacos' | 'drinks';

export type DietaryTag = 'all' | 'vegetarian' | 'gluten-free' | 'high-protein' | 'chef-signature';

export interface CustomOption {
  id: string;
  name: string;
  price: number;
  threeLayerKey?: string; // connects to 3D model visibility
  defaultSelected?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'burgers' | 'pizzas' | 'bowls' | 'tacos' | 'drinks';
  price: number;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  calories: number;
  dietary: DietaryTag[];
  modelType: 'burger' | 'pizza' | 'bowl' | 'boba' | 'taco';
  ingredients: string[];
  allergens: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  customOptions: CustomOption[];
  badge?: string;
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedOptions: CustomOption[];
  itemPrice: number; // base + options
  specialInstructions?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'card' | 'cod' | 'apple_pay';
  status: 'received' | 'prepping' | 'on_the_way' | 'delivered';
  estimatedArrivalMinutes: number;
}
