import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import {
  AdminDashboardPage,
  BookDetailPage,
  BooksPage,
  CheckoutPage,
  CartPage,
  ForgotPasswordPage,
  GenrePage,
  HomePage,
  LoginPage,
  OrdersPage,
  NewReleases,
  PageNotFound,
  Unauthorised,
  SearchPage,
  SignUpPage,
} from './pages';
import RoutePrivilege from './components/layout/RoutePrivilege';
import { PageRoutes } from './utils/pageRoutes';
import { Toaster } from 'react-hot-toast';
import LoadingUI from './components/ui/Loader';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path={PageRoutes.home} element={<HomePage />} />
              <Route path={PageRoutes.books} element={<BooksPage />} />
              <Route path={`${PageRoutes.books}/:id`} element={<BookDetailPage />} />
              <Route path={PageRoutes.cart} element={<CartPage />} />
              <Route path={PageRoutes.checkout} element={<CheckoutPage />} />
              <Route path={PageRoutes.auth.login} element={<LoginPage />} />
              <Route path={PageRoutes.auth.signup} element={<SignUpPage />} />
              <Route path={PageRoutes.auth.forgotPassword} element={<ForgotPasswordPage />} />
              <Route path={PageRoutes.orders} element={<OrdersPage />} />
              <Route path={PageRoutes.search} element={<SearchPage />} />
              <Route path={PageRoutes.newRelease} element={<NewReleases />} />
              <Route path={`${PageRoutes.genres}/:genre"`} element={<GenrePage />} />

              <Route path="/" element={<RoutePrivilege />}>
                <Route path={PageRoutes.dashboard} element={<AdminDashboardPage />} />
              </Route>

              <Route path={PageRoutes.auth.unauthorised} element={<Unauthorised />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </CartProvider>
        </AuthProvider>

        <Toaster />
      </Router>

      <LoadingUI />
    </>
  );
}

export default App;