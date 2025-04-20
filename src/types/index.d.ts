// Type definitions for the application

type AppConfig = {
  _id?: string,
  name: string;
  email: string;
  isLoggedIn: boolean;
  contact: string;
  socials: {
    instagram: '',
    facebook: '',
    twitter: '',
  };
  address?: string;
  createdAt?: string,
  updatedAt?: string,
  sessionId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  appName: AppConfig;
  setAppName: React.Dispatch<React.SetStateAction<AppConfig>>;
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
type ModalSelectionsType = 'books' | 'users' | 'orders' | 'overview';

interface UserPreferences {
  favoriteGenres: string[];
  wishlist: string[]; // Book IDs
}

type ResponseData<DATA> = {
  timestamp: string;
  message: string;
  statusCode: number;
  data: DATA
}

type ErrorResponse = {
  response: {
    data: {
      timestamp: string;
      error: {
        statusCode: number;
        success: boolean;
        message: string;
      }
    }
  }
}

type Rating = { bookId: string, rating: number }