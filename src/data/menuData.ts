import { MenuItem } from '../types/food';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'burger-truffle-brioche',
    name: 'Artisan Truffle Brioche Burger',
    tagline: 'Dry-aged Angus beef, black truffle aioli & aged Gruyère',
    description: 'Fresh ground 100% pasture-raised Angus chuck patty, seared on cast iron, blanketed in melted Swiss Gruyère and cave-aged white cheddar, caramelized shallots, crisp butterhead lettuce, and farm-fresh heirloom tomato on a toasted sesame brioche bun.',
    category: 'burgers',
    price: 16.50,
    rating: 4.9,
    reviewCount: 342,
    prepTimeMinutes: 18,
    calories: 780,
    dietary: ['chef-signature', 'high-protein'],
    modelType: 'burger',
    ingredients: [
      'Artisan Brioche Bun with Sesame Seeds',
      'Black Truffle Garlic Aioli',
      'Heirloom Beefsteak Tomato Slice',
      'Ruffled Butterhead Lettuce',
      'Melted Swiss Gruyère Cheese',
      'Pasture-Raised Angus Beef Patty (200g)',
      'Balsamic Glazed Caramelized Onions',
      'Toasted Bottom Brioche Bun'
    ],
    allergens: ['Gluten', 'Dairy', 'Eggs', 'Sesame'],
    nutrition: {
      protein: '42g',
      carbs: '48g',
      fat: '38g',
      fiber: '4g'
    },
    customOptions: [
      { id: 'opt_double_patty', name: 'Add Double Angus Beef Patty', price: 4.50, threeLayerKey: 'extraPatty' },
      { id: 'opt_extra_cheese', name: 'Extra Melted Cheddar & Gruyère', price: 1.75, threeLayerKey: 'extraCheese', defaultSelected: true },
      { id: 'opt_crispy_bacon', name: 'Applewood Smoked Crispy Bacon', price: 2.25, threeLayerKey: 'bacon' },
      { id: 'opt_avocado', name: 'Fresh Sliced Hass Avocado', price: 2.00, threeLayerKey: 'avocado' },
      { id: 'opt_jalapenos', name: 'Pickled Fire Jalapeño Coins', price: 1.00, threeLayerKey: 'jalapenos' }
    ],
    badge: "Chef's Signature"
  },
  {
    id: 'pizza-woodfired-margherita',
    name: 'Campania Wood-Fired Pizza',
    tagline: 'San Marzano D.O.P., fior di latte mozzarella & fresh sweet basil',
    description: 'Fermented 48-hour sourdough crust baked at 900°F with charred blistering. Layered with crushed Italian San Marzano tomatoes, fresh hand-torn fior di latte mozzarella, fresh sweet basil, and a generous drizzle of first-press Sicilian extra virgin olive oil.',
    category: 'pizzas',
    price: 18.00,
    rating: 4.8,
    reviewCount: 289,
    prepTimeMinutes: 15,
    calories: 840,
    dietary: ['vegetarian', 'chef-signature'],
    modelType: 'pizza',
    ingredients: [
      '48-Hr Fermented Sourdough Crust',
      'Crushed San Marzano D.O.P. Tomatoes',
      'Fior di Latte Fresh Mozzarella',
      'Hand-Torn Organic Sweet Basil',
      'Cold-Pressed Extra Virgin Olive Oil',
      'Sea Salt & Cracked Black Pepper'
    ],
    allergens: ['Gluten', 'Dairy'],
    nutrition: {
      protein: '31g',
      carbs: '86g',
      fat: '24g',
      fiber: '5g'
    },
    customOptions: [
      { id: 'opt_pepperoni', name: 'Artisan Cupped Pepperoni Slices', price: 3.00, threeLayerKey: 'pepperoni', defaultSelected: true },
      { id: 'opt_burrata', name: 'Creamy Fresh Burrata Center', price: 3.50, threeLayerKey: 'burrata' },
      { id: 'opt_hot_honey', name: 'Spicy Chili Infused Hot Honey Drizzle', price: 1.50, threeLayerKey: 'hotHoney' },
      { id: 'opt_olives', name: 'Castelvetrano Green Olives', price: 1.75, threeLayerKey: 'olives' },
      { id: 'opt_gf_crust', name: 'Gluten-Free Cauliflower Crust', price: 2.50 }
    ],
    badge: 'Wood-Fired'
  },
  {
    id: 'bowl-pacific-salmon-poke',
    name: 'Pacific Rainbow Salmon Poke Bowl',
    tagline: 'Sashimi-grade salmon, Hass avocado, edamame & ponzu glaze',
    description: 'Wild sashimi-grade king salmon cubes tossed in house ginger-shoyu sesame glaze over steamed premium short-grain sushi rice. Adorned with fan-sliced ripe avocado, sweet edamame beans, crisp Persian cucumber wheels, pickled ginger ribbons, and furikake.',
    category: 'bowls',
    price: 17.50,
    rating: 4.9,
    reviewCount: 215,
    prepTimeMinutes: 12,
    calories: 590,
    dietary: ['gluten-free', 'high-protein'],
    modelType: 'bowl',
    ingredients: [
      'Wild Pacific King Salmon Sashimi Cubes',
      'Steamed Premium Koshihikari Sushi Rice',
      'Fresh Fan-Sliced Hass Avocado',
      'Shelled Organic Edamame Beans',
      'Crisp Persian Cucumber Wheels',
      'Pickled Pink Ginger & Wakame Seaweed',
      'Toasted White & Black Sesame Seeds',
      'Citrus Ginger Ponzu Dressing'
    ],
    allergens: ['Fish', 'Soy', 'Sesame'],
    nutrition: {
      protein: '36g',
      carbs: '62g',
      fat: '22g',
      fiber: '7g'
    },
    customOptions: [
      { id: 'opt_extra_salmon', name: 'Extra Sashimi Salmon (+60g)', price: 4.50, threeLayerKey: 'extraSalmon' },
      { id: 'opt_spicy_mayo', name: 'Spicy Sriracha Japanese Mayo', price: 1.00, threeLayerKey: 'spicyMayo', defaultSelected: true },
      { id: 'opt_crispy_onions', name: 'Golden Crispy Fried Shallots', price: 1.25, threeLayerKey: 'crispyShallots' },
      { id: 'opt_quinoa_base', name: 'Swap Rice for Organic Quinoa Base', price: 1.50 },
      { id: 'opt_mango', name: 'Diced Sweet Manila Mango', price: 1.75, threeLayerKey: 'mango' }
    ],
    badge: 'Fresh & Clean'
  },
  {
    id: 'taco-crispy-baja-fish',
    name: 'Crispy Baja Pacific Fish Tacos',
    tagline: 'Beer-battered cod, chipotle crema & pickled cabbage slaw',
    description: 'Three warm stone-ground yellow corn tortillas filled with golden crispy Pacific wild cod, shredded purple cabbage tossed in lime vinaigrette, chipotle crema drizzle, fresh radish matchsticks, chopped cilantro, and fresh lime wedges.',
    category: 'tacos',
    price: 15.25,
    rating: 4.8,
    reviewCount: 178,
    prepTimeMinutes: 14,
    calories: 520,
    dietary: ['high-protein'],
    modelType: 'taco',
    ingredients: [
      'Stone-Ground Corn Tortillas (Trio)',
      'Crisp Golden Beer-Battered Pacific Cod',
      'Zesty Pickled Red Cabbage Slaw',
      'Smoky Chipotle Crema Dressing',
      'Shaved Crunchy Radish Matchsticks',
      'Fresh Farm Cilantro Leaves',
      'Fresh Juicy Lime Wedges'
    ],
    allergens: ['Fish', 'Gluten', 'Eggs'],
    nutrition: {
      protein: '28g',
      carbs: '54g',
      fat: '21g',
      fiber: '5g'
    },
    customOptions: [
      { id: 'opt_guacamole', name: 'Side of Fresh Chunky Guacamole', price: 2.50, threeLayerKey: 'guacamole', defaultSelected: true },
      { id: 'opt_extra_taco', name: 'Add 4th Baja Taco to Platter', price: 4.00, threeLayerKey: 'extraTaco' },
      { id: 'opt_habanero_salsa', name: 'Fire-Roasted Habanero Hot Sauce', price: 1.00, threeLayerKey: 'hotSauce' },
      { id: 'opt_cotija', name: 'Crumbled Salty Cotija Cheese', price: 1.25, threeLayerKey: 'cotija' }
    ],
    badge: 'Crispy Trio'
  },
  {
    id: 'drink-matcha-cloud-boba',
    name: 'Ceremonial Matcha Boba Cloud',
    tagline: 'Uji ceremonial grade matcha, slow-cooked boba & cloud foam',
    description: 'First-harvest Kyoto Uji ceremonial matcha whisked with cold oat milk over slow-simmered brown sugar tapioca pearls, topped with a velvety whipped sea salt cloud cream and a dusting of green tea powder.',
    category: 'drinks',
    price: 7.50,
    rating: 4.9,
    reviewCount: 412,
    prepTimeMinutes: 6,
    calories: 310,
    dietary: ['vegetarian'],
    modelType: 'boba',
    ingredients: [
      'First-Harvest Kyoto Uji Ceremonial Matcha',
      'Slow-Simmered Brown Sugar Boba Pearls',
      'Creamy Barista Oat Milk',
      'Whipped Himalayan Sea Salt Cloud Cream',
      'Pure Mineral Ice Cubes',
      'Organic Amber Agave Nectar'
    ],
    allergens: ['Gluten (in oat milk, option to swap)'],
    nutrition: {
      protein: '4g',
      carbs: '46g',
      fat: '8g',
      fiber: '2g'
    },
    customOptions: [
      { id: 'opt_extra_boba', name: 'Extra Brown Sugar Boba Pearls', price: 1.00, threeLayerKey: 'extraBoba', defaultSelected: true },
      { id: 'opt_cheese_foam', name: 'Extra Thick Salted Cream Foam', price: 1.25, threeLayerKey: 'extraFoam' },
      { id: 'opt_less_sweet', name: '50% Sweetness (Balanced)', price: 0.00 },
      { id: 'opt_zero_sweet', name: 'Unsweetened (Pure Matcha)', price: 0.00 },
      { id: 'opt_almond_milk', name: 'Swap Oat Milk with Almond Milk', price: 0.75 }
    ],
    badge: 'Artisan Drink'
  },
  {
    id: 'burger-smash-double-cheddar',
    name: 'Cast-Iron Double Smashed Burger',
    tagline: 'Crispy lacy edges, double American cheddar & secret house relish',
    description: 'Two thin smashed beef patties seared on smoking cast iron for maximal lacy, crunchy edges. Doubled melted sharp cheddar, dill pickle rounds, finely minced sweet onions, and tangy golden house sauce on a buttered potato bun.',
    category: 'burgers',
    price: 14.75,
    rating: 4.8,
    reviewCount: 520,
    prepTimeMinutes: 12,
    calories: 740,
    dietary: ['high-protein'],
    modelType: 'burger',
    ingredients: [
      'Buttered Golden Potato Bun',
      'Double Crispy Smashed Beef Patties',
      'Melted Sharp Cheddar Slices',
      'Crunchy Barrel-Aged Dill Pickles',
      'Minced Sweet Walla Walla Onions',
      'Golden Secret Diner Sauce'
    ],
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    nutrition: {
      protein: '40g',
      carbs: '44g',
      fat: '39g',
      fiber: '2g'
    },
    customOptions: [
      { id: 'opt_bacon_strips', name: 'Double Applewood Bacon', price: 2.25, threeLayerKey: 'bacon' },
      { id: 'opt_extra_cheese_slice', name: 'Triple Cheese Layer', price: 1.50, threeLayerKey: 'extraCheese' },
      { id: 'opt_fried_egg', name: 'Sunny-Side Pasture Egg', price: 1.75 }
    ]
  },
  {
    id: 'pizza-wild-truffle-mushroom',
    name: 'Wild Forest Truffle & Funghi Pizza',
    tagline: 'Roasted cremini, shiitake, black garlic cream & thyme',
    description: 'White sourdough pizza with roasted field mushrooms, shiitake, and thyme over creamy mascarpone and smoked provolone, finished with white truffle oil and fresh cracked pink peppercorn.',
    category: 'pizzas',
    price: 19.50,
    rating: 4.9,
    reviewCount: 164,
    prepTimeMinutes: 16,
    calories: 790,
    dietary: ['vegetarian', 'chef-signature'],
    modelType: 'pizza',
    ingredients: [
      'Fermented Sourdough Crust',
      'Roasted Cremini & Shiitake Mushrooms',
      'Creamy Mascarpone Base Sauce',
      'Smoked Provolone & Fontina Cheese',
      'Italian White Truffle Infusion',
      'Fresh Garden Thyme & Pink Peppercorn'
    ],
    allergens: ['Gluten', 'Dairy'],
    nutrition: {
      protein: '27g',
      carbs: '82g',
      fat: '29g',
      fiber: '6g'
    },
    customOptions: [
      { id: 'opt_prosciutto', name: 'Aged 24-Mo Prosciutto di Parma', price: 4.00 },
      { id: 'opt_extra_truffle', name: 'Shaved Black Winter Truffle', price: 5.00 },
      { id: 'opt_arugula', name: 'Baby Organic Wild Arugula Top', price: 1.50 }
    ]
  },
  {
    id: 'bowl-mediterranean-falafel',
    name: 'Herbed Mediterranean Grain Bowl',
    tagline: 'Golden falafel, warm za\'atar grains, hummus & tahini drizzle',
    description: 'Crispy house-made chickpea herb falafels nestled on fluffy za\'atar spiced quinoa and farro, roasted spiced chickpeas, creamy garlic hummus, kalamata olives, diced Persian cucumbers, and lemon tahini dressing.',
    category: 'bowls',
    price: 15.50,
    rating: 4.7,
    reviewCount: 190,
    prepTimeMinutes: 14,
    calories: 560,
    dietary: ['vegetarian', 'high-protein'],
    modelType: 'bowl',
    ingredients: [
      'Golden Crisp Herb Falafels (4pcs)',
      'Ancient Grains: Farro & Red Quinoa',
      'House Whipped Lemon-Garlic Hummus',
      'Kalamata Olives & Cherry Tomatoes',
      'Pickled Red Onions & Parsley',
      'Creamy Garlic Sesame Tahini Sauce'
    ],
    allergens: ['Sesame'],
    nutrition: {
      protein: '22g',
      carbs: '68g',
      fat: '20g',
      fiber: '14g'
    },
    customOptions: [
      { id: 'opt_extra_falafel', name: 'Add 2 Extra Hot Falafels', price: 2.00 },
      { id: 'opt_feta', name: 'Crumbled Sheep Milk Feta', price: 1.75 },
      { id: 'opt_pita', name: 'Warm Fluffy Pocket Pita', price: 1.50 }
    ]
  }
];

export const CATEGORIES: { id: MenuItem['category'] | 'all'; label: string }[] = [
  { id: 'all', label: 'All Dishes' },
  { id: 'burgers', label: 'Artisanal Burgers' },
  { id: 'pizzas', label: 'Wood-Fired Pizzas' },
  { id: 'bowls', label: 'Fresh Poke & Bowls' },
  { id: 'tacos', label: 'Street Tacos' },
  { id: 'drinks', label: 'Craft Drinks' }
];

export const DIETARY_FILTERS: { id: MenuItem['dietary'][number] | 'all'; label: string }[] = [
  { id: 'all', label: 'All Preferences' },
  { id: 'chef-signature', label: "Chef's Signature" },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'high-protein', label: 'High Protein (25g+)' }
];
