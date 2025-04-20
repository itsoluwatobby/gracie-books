import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import {
  AdminDashboardPage,
  BookDetailPage,
  BooksPage,
  CartPage,
  ForgotPasswordPage,
  GenrePage,
  HomePage,
  LoginPage,
  OrdersPage,
  NewReleases,
  PageNotFound,
  SearchPage,
  SignUpPage,
} from './pages';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/new-releases" element={<NewReleases />} />
            <Route path="/genres/:genre" element={<GenrePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;