// Type definitions for the application

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

interface Book {
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

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface CartItem {
  book: Book;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: ShippingAddress;
}

interface OrderItem {
  bookId: string;
  title: string;
  quantity: number;
  priceAtPurchase: number;
}

interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface UserPreferences {
  favoriteGenres: string[];
  wishlist: string[]; // Book IDs
}