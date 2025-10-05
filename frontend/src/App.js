import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import ProductsPage from "./pages/ProductsPage";
import SingleProducts from "./pages/SingleProducts";
import store from "./store/store";
import Footer from "./pages/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { fetchCurrentUser } from "./store/authSlice";
import { useEffect } from "react";
import Orders from "./pages/Orders";

// Yeh component refresh hone ke baad user ko dobara Redux me laayega
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // wahi naam use karo jo storage me hai
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

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
          <AppContent />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
