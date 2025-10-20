/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect } from 'react';
import { connect, Socket } from 'socket.io-client';


let socket: Socket;
function App() {

  // useEffect(() => {
  //   fetch("https://korrin-ai-backend.onrender.com/api/v1/auth/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(
  //       {
  //         // "full_name": "Mathew Dane",
  //         // "stage_name": "mat dane",
  //         "email": "itsoluwatobby+korrin@gmail.com",
  //         // "token": "327685",
  //         "password": "Abcd1234$",
  //     //     "confirm_password": "Abcd1234$",
  //     //     "phone_number": "08100001234",
  //     //     "agree_to_terms_and_condition": false,
  //       }
  //     )
  //   })
  // }, [])

  useEffect(() => {
    // socket = connect("http://3.254.118.10:5000");
    socket = connect("http://172.31.32.190:5000");
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED")
      socket.emit(
        "join",
        {
          "conversationId": "6850631a6274a64264c7396f",
          "userId": "66a91e5870365e2063e4b7b1",
          "name": "Matthew"
        },
        (data: any) => {
          console.log(data)
        }
      )
    })
  }, []);

  useEffect(() => {
    socket.on("user_joined", (data) => {
      console.log(data);
    })
  }, []);

  return (
    <main className=''>
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
    </main>
  );
}

export default App;