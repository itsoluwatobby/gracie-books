// Type definitions for the application

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImage: string;
  isbn: string;
  publisher: string;
  publicationDate: string;
  pageCount: number;
  genre: string[];
  stockQuantity: number;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
}

export interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface UserPreferences {
  favoriteGenres: string[];
  wishlist: string[]; // Book IDs
}