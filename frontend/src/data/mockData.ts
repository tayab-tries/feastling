export type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
};

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  distance: string;
  cuisine: string;
  featured: boolean;
  menu: MenuItem[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export const categories: Category[] = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'burgers', name: 'Burgers', icon: 'fast-food-outline' },
  { id: 'pizza', name: 'Pizza', icon: 'pizza-outline' },
  { id: 'sushi', name: 'Sushi', icon: 'fish-outline' },
  { id: 'asian', name: 'Asian', icon: 'restaurant-outline' },
  { id: 'indian', name: 'Indian', icon: 'flame-outline' },
  { id: 'healthy', name: 'Healthy', icon: 'leaf-outline' },
  { id: 'dessert', name: 'Dessert', icon: 'ice-cream-outline' },
];

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger Palace',
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.8,
    reviewCount: 324,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    distance: '1.2 km',
    cuisine: 'burgers',
    featured: true,
    menu: [
      {
        id: 'm1',
        name: 'Classic Smash Burger',
        price: 12.99,
        image: 'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Juicy beef patty with melted cheddar, lettuce, tomato & secret sauce',
        category: 'Mains',
      },
      {
        id: 'm2',
        name: 'Double Stack',
        price: 16.99,
        image: 'https://images.pexels.com/photos/2282532/pexels-photo-2282532.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Two smashed patties, double cheese, pickles, onion rings',
        category: 'Mains',
      },
      {
        id: 'm3',
        name: 'Truffle Fries',
        price: 6.99,
        image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Crispy golden fries drizzled with truffle oil & parmesan',
        category: 'Sides',
      },
      {
        id: 'm4',
        name: 'Oreo Milkshake',
        price: 7.99,
        image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Thick creamy milkshake loaded with Oreo cookies',
        category: 'Drinks',
      },
      {
        id: 'm5',
        name: 'Chicken Wings',
        price: 10.99,
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Crispy wings tossed in spicy buffalo sauce, served with ranch',
        category: 'Sides',
      },
    ],
  },
  {
    id: 'r2',
    name: 'Pizza Roma',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviewCount: 512,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    distance: '0.8 km',
    cuisine: 'pizza',
    featured: true,
    menu: [
      {
        id: 'm6',
        name: 'Margherita',
        price: 14.99,
        image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'San Marzano tomatoes, fresh mozzarella, basil on Neapolitan crust',
        category: 'Pizza',
      },
      {
        id: 'm7',
        name: 'Pepperoni Supreme',
        price: 17.99,
        image: 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Loaded with pepperoni, mozzarella, and oregano',
        category: 'Pizza',
      },
      {
        id: 'm8',
        name: 'Garlic Breadsticks',
        price: 5.99,
        image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Warm breadsticks brushed with garlic butter',
        category: 'Sides',
      },
      {
        id: 'm9',
        name: 'Tiramisu',
        price: 8.99,
        image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Classic Italian dessert with mascarpone and espresso',
        category: 'Dessert',
      },
    ],
  },
  {
    id: 'r3',
    name: 'Sakura Sushi',
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.9,
    reviewCount: 287,
    deliveryTime: '30-40 min',
    deliveryFee: 3.99,
    distance: '2.5 km',
    cuisine: 'sushi',
    featured: true,
    menu: [
      {
        id: 'm10',
        name: 'Salmon Nigiri Set',
        price: 18.99,
        image: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: '8 pieces of premium salmon nigiri',
        category: 'Sushi',
      },
      {
        id: 'm11',
        name: 'Dragon Roll',
        price: 16.99,
        image: 'https://images.pexels.com/photos/3298180/pexels-photo-3298180.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Shrimp tempura, avocado, eel, tobiko',
        category: 'Rolls',
      },
      {
        id: 'm12',
        name: 'Miso Soup',
        price: 4.99,
        image: 'https://images.pexels.com/photos/3659862/pexels-photo-3659862.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Traditional miso with tofu, seaweed, green onion',
        category: 'Soups',
      },
      {
        id: 'm13',
        name: 'Edamame',
        price: 5.99,
        image: 'https://images.pexels.com/photos/2089717/pexels-photo-2089717.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Steamed and salted soybeans',
        category: 'Starters',
      },
    ],
  },
  {
    id: 'r4',
    name: 'Dragon Wok',
    image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    reviewCount: 198,
    deliveryTime: '15-25 min',
    deliveryFee: 1.49,
    distance: '0.5 km',
    cuisine: 'asian',
    featured: false,
    menu: [
      {
        id: 'm14',
        name: 'Kung Pao Chicken',
        price: 13.99,
        image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Spicy stir-fried chicken with peanuts and chili peppers',
        category: 'Mains',
      },
      {
        id: 'm15',
        name: 'Beef Chow Mein',
        price: 12.99,
        image: 'https://images.pexels.com/photos/2456435/pexels-photo-2456435.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Wok-tossed noodles with tender beef and vegetables',
        category: 'Noodles',
      },
      {
        id: 'm16',
        name: 'Spring Rolls',
        price: 6.99,
        image: 'https://images.pexels.com/photos/2098058/pexels-photo-2098058.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Crispy vegetable spring rolls with sweet chili sauce',
        category: 'Starters',
      },
      {
        id: 'm17',
        name: 'Fried Rice',
        price: 9.99,
        image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Egg fried rice with mixed vegetables',
        category: 'Rice',
      },
    ],
  },
  {
    id: 'r5',
    name: 'Spice Garden',
    image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.6,
    reviewCount: 156,
    deliveryTime: '25-35 min',
    deliveryFee: 2.49,
    distance: '1.8 km',
    cuisine: 'indian',
    featured: false,
    menu: [
      {
        id: 'm18',
        name: 'Butter Chicken',
        price: 15.99,
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Tender chicken in rich, creamy tomato-butter sauce',
        category: 'Curry',
      },
      {
        id: 'm19',
        name: 'Garlic Naan',
        price: 3.99,
        image: 'https://images.pexels.com/photos/1117862/pexels-photo-1117862.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Soft naan bread brushed with garlic butter',
        category: 'Bread',
      },
      {
        id: 'm20',
        name: 'Chicken Biryani',
        price: 14.99,
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Fragrant basmati rice layered with spiced chicken',
        category: 'Rice',
      },
      {
        id: 'm21',
        name: 'Samosas',
        price: 5.99,
        image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Crispy pastry filled with spiced potatoes and peas',
        category: 'Starters',
      },
    ],
  },
  {
    id: 'r6',
    name: 'Green Bowl',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.7,
    reviewCount: 210,
    deliveryTime: '15-20 min',
    deliveryFee: 1.99,
    distance: '0.6 km',
    cuisine: 'healthy',
    featured: true,
    menu: [
      {
        id: 'm22',
        name: 'Acai Bowl',
        price: 11.99,
        image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Acai blend topped with granola, banana, berries',
        category: 'Bowls',
      },
      {
        id: 'm23',
        name: 'Quinoa Salad',
        price: 10.99,
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Fresh quinoa with avocado, cherry tomatoes, cucumber',
        category: 'Salads',
      },
      {
        id: 'm24',
        name: 'Green Smoothie',
        price: 7.99,
        image: 'https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Spinach, kale, banana, mango, chia seeds',
        category: 'Drinks',
      },
      {
        id: 'm25',
        name: 'Grilled Chicken Bowl',
        price: 13.99,
        image: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'Grilled chicken with brown rice, avocado, edamame',
        category: 'Bowls',
      },
    ],
  },
];

export const getRestaurantById = (id: string): Restaurant | undefined =>
  restaurants.find((r) => r.id === id);

export const getRestaurantsByCategory = (categoryId: string): Restaurant[] =>
  categoryId === 'all'
    ? restaurants
    : restaurants.filter((r) => r.cuisine === categoryId);

export const getFeaturedRestaurants = (): Restaurant[] =>
  restaurants.filter((r) => r.featured);

export const searchRestaurants = (query: string): Restaurant[] => {
  const q = query.toLowerCase();
  return restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.menu.some((m) => m.name.toLowerCase().includes(q))
  );
};
