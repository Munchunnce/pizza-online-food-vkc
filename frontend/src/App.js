import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminRoute from "./components/AdminRoute";
import AdminOrders from "./pages/AdminOrders";
import Cart from "./pages/Cart";
import ProductsPage from "./pages/ProductsPage";
import SingleProducts from "./pages/SingleProducts";
import store from "./store/store";
import Footer from "./pages/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchCurrentUser, logout, refreshToken, restoreTokens } from "./store/authSlice";
import { useEffect } from "react";
import Orders from "./pages/Orders";
import SingleOrder from "./pages/SingleOrder";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// ✅ Stripe public key
const stripePromise = loadStripe(
  "pk_test_51SDlgPRz3ObFp51Jl6MYMamJjAAtFf03juq4FEQCSQuq1l2lJPQvjktWk6YZETIxySNgc1fZyg18mhchrJLRXzO000K1k53Qp7"
);

const AppContent = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken: savedRefreshToken } = useSelector(
    (state) => state.auth
  );

  // Restore tokens from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");
    if (storedAccessToken && storedRefreshToken) {
      dispatch(
        restoreTokens({
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        })
      );
    }
  }, [dispatch]);

  // Fetch user on load
  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken && savedRefreshToken) {
        const refreshRes = await dispatch(refreshToken());
        if (refreshRes.meta.requestStatus === "fulfilled") {
          await dispatch(fetchCurrentUser());
        } else {
          dispatch({ type: "auth/logout" });
        }
      } else if (accessToken) {
        await dispatch(fetchCurrentUser());
      }
    };
    fetchUser();
  }, [dispatch, accessToken, savedRefreshToken]);

  // Auto refresh token
  useEffect(() => {
    if (!savedRefreshToken) return;
    const interval = setInterval(() => {
      dispatch(refreshToken());
    }, 50 * 1000);
    return () => clearInterval(interval);
  }, [dispatch, savedRefreshToken]);

  return (
    <>
      <Navigation />
      <div className="flex-1">
        <Routes>
          <Route path="/" exact element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/products" exact element={<ProductsPage />}></Route>
          <Route path="/products/:_id" element={<SingleProducts />}></Route>
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/customer/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/customer/orders/:id"
            element={
              <ProtectedRoute>
                <SingleOrder />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/admin/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
        } />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      <Provider store={store}>
        <BrowserRouter>
          {/* ✅ Stripe Elements wrapper here */}
          <Elements stripe={stripePromise}>
            <AppContent />
          </Elements>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
