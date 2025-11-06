export interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: Review[];
  tags: string[];
}

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  total: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: Date;
}

export interface User {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  wishlist: WishlistItem[];
  preferences: {
    favoriteCategories: string[];
    priceRange: { min: number; max: number };
  };
}

export interface WishlistItem {
  productId: string;
  addedAt: Date;
}

export interface Analytics {
  cart: {
    itemCount: number;
    total: number;
  };
  orders: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
  };
  recentActivity: {
    lastOrder: Order | null;
    itemsInCart: CartItem[];
  };
}
