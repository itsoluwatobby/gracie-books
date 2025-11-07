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
  OrderDetailPage,
  ProfilePage,
} from './pages';
import RoutePrivilege from './components/layout/RoutePrivilege';
import { PageRoutes } from './utils/pageRoutes';
import { Toaster } from 'react-hot-toast';
import LoadingUI from './components/ui/Loader';
import AuthLayout from './components/layout/AuthLayout';
import { ProtectedRoutes } from './components/layout/ProtectedRoutes';
import { BooksProvider } from './context/BooksContext';


function App() {

  return (
    <main>
      <Router>
        <AuthProvider>
          <BooksProvider>
            <CartProvider>
              <Routes>
                <Route path={PageRoutes.home} element={<HomePage />} />
                <Route path={PageRoutes.books} element={<BooksPage />} />
                <Route path={`${PageRoutes.books}/:id`} element={<BookDetailPage />} />
                <Route path={PageRoutes.cart} element={<CartPage />} />
                
                <Route path="/" element={<ProtectedRoutes />}>
                
                  <Route path={PageRoutes.checkout} element={<CheckoutPage />} />
                  <Route path={`${PageRoutes.profile}/:userId`} element={<ProfilePage />} />
                  <Route path={PageRoutes.orders} element={<OrdersPage />} />
                  <Route path={`${PageRoutes.orders}/:id`} element={<OrderDetailPage />} />
                  
                  <Route path="/" element={<RoutePrivilege />}>
                    <Route path={PageRoutes.dashboard} element={<AdminDashboardPage />} />
                  </Route>
                
                </Route>

                <Route path="/" element={<AuthLayout />}>
                  <Route path={PageRoutes.auth.login} element={<LoginPage />} />
                  <Route path={PageRoutes.auth.signup} element={<SignUpPage />} />
                  <Route path={PageRoutes.auth.forgotPassword} element={<ForgotPasswordPage />} />
                </Route>

                <Route path={PageRoutes.search} element={<SearchPage />} />
                <Route path={PageRoutes.newRelease} element={<NewReleases />} />
                <Route path={`${PageRoutes.genres}/:genre"`} element={<GenrePage />} />


                <Route path={PageRoutes.auth.unauthorised} element={<Unauthorised />} />

                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </CartProvider>
          </BooksProvider>
        </AuthProvider>

        <Toaster />
      </Router>

      <LoadingUI />
    </main>
  );
}

export default App;