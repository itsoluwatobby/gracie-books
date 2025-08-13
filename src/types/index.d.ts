// Type definitions for the application

type AppConfig = {
  _id?: string,
  name: string;
  email: string;
  isLoggedIn: boolean;
  contact: string;
  socials: {
    instagram: string,
    facebook: string,
    twitter: string,
  };
  address?: string;
  createdAt?: string,
  updatedAt?: string,
  sessionId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  appName: AppConfig;
  loading: boolean;
  logout: () => void;
  setAppName: React.Dispatch<React.SetStateAction<AppConfig>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
  subtitle: string;
  authors: string[];
  description: string;
  price: number;
  coverImage: string;
  previewImages: string[];
  previewImages: string[];
  isbn: string;
  publisher: string;
  publicationDate: string;
  discount: string;
  pageCount: number;
  genre: string[];
  stockQuantity: number;
  rating: number;
  ratingSource: string;
  ratingsCount: number;
  readingModes: { image: boolean, text: boolean };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  fullName: string;
  profilePicture: string;
  email: string;
  password: string;
  role: string; // 1140 | 1155
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartItem {
  book: Book;
  quantity: number;
  price: number;
  orderId: string;
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
type PriceRangePropTypes = { min: number, max: number }