import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/CartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  // User info for order
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleIncrease = (product) => {
    dispatch(addToCart(product));
  };

  const handleDecrease = (productId) => {
    const item = cart.items[productId];
    if (item && item.quantity > 1) {
      dispatch(decreaseQuantity(productId));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // ✅ Order Now handler with address & phone
  const handleOrderNow = () => {
    if (cart.totalItems === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!phone || !address) {
      alert("Please enter your phone number and address!");
      return;
    }

    // Here you can also send order data to backend API
    const orderData = {
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice: Object.values(cart.items).reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
      phone,
      address,
    };

    console.log("Order Placed:", orderData); // Backend API call placeholder

    alert("🎉 Order placed successfully!");
    dispatch(clearCart());
    setPhone("");
    setAddress("");
  };

  const totalPrice = Object.values(cart.items).reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (!cart.totalItems) {
    return (
      <div className="empty-cart py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Cart Empty 😕</h1>
          <p className="text-gray-500 text-lg mb-12">
            You probably haven't ordered a pizza yet. <br />
            To order a pizza, go to the main page.
          </p>
          <img
            className="w-2/5 mx-auto"
            src="/images/empty-cart.png"
            alt="empty-cart"
          />
          <Link to="/" className="inline-block mt-12">
            <button className="bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-1 px-3 sm:px-5 rounded-full font-bold cursor-pointer transition-colors duration-200 flex items-center">
              Go back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="cart py-16">
      <div className="order container mx-auto xl:w-1/2">
        <div className="flex items-center border-b border-gray-300 pb-4">
          <h1 className="font-bold text-2xl">Order summary</h1>
        </div>

        <div className="pizza-list">
          {Object.values(cart.items).map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 p-4 border rounded-lg shadow-sm"
            >
              {/* Left: Image + Name */}
              <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto">
                <img
                  className="w-24 h-24 object-cover rounded mx-auto sm:mx-0"
                  src={item.product.image}
                  alt={item.product.name}
                />
                <div className="flex-1 sm:ml-4 text-center sm:text-left mt-3 sm:mt-0">
                  <h1 className="font-semibold text-lg">{item.product.name}</h1>
                  <span className="text-gray-600 text-sm">
                    {item.product.size}
                  </span>
                </div>
              </div>

              {/* Middle: Quantity Controls */}
              <div className="flex items-center justify-center mt-3 sm:mt-0 space-x-2">
                <button
                  onClick={() => handleDecrease(item.product._id)}
                  disabled={item.quantity === 1}
                  className={`px-3 py-1 rounded-full cursor-pointer 
                    ${item.quantity === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                    }`}
                >
                  -
                </button>
                <span className="font-medium">{item.quantity} Pcs</span>
                <button
                  onClick={() => handleIncrease(item.product)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Right: Price + Remove */}
              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mt-3 sm:mt-0 text-center sm:text-left">
                <span className="font-bold text-lg text-[#FE5F1E]">
                  ₹ {item.product.price * item.quantity}
                </span>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="mt-2 sm:mt-0 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full cursor-pointer transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr />

        {/* Phone & Address Form + Total Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start py-6 space-y-4 md:space-y-0 md:space-x-6">
          {/* Left: Total Amount */}
          <div className="text-left">
            <span className="text-lg font-bold">Total Amount:</span>
            <span className="amount text-2xl font-bold ml-2">
              ₹ {totalPrice}
            </span>
          </div>

          {/* Right: Phone & Address */}
          <div className="flex flex-col space-y-3 w-full md:w-64">
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-400 px-3 py-1 rounded w-full"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-gray-400 px-3 py-1 rounded w-full"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleClearCart}
            className="border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white transition-colors duration-200 px-6 py-2 rounded-full font-bold cursor-pointer"
          >
            Clear Cart
          </button>
          <button
            onClick={handleOrderNow}
            className="px-6 py-2 rounded-full bg-[#FE5F1E] hover:bg-[#e64e10] text-white font-bold transition duration-300 cursor-pointer"
          >
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;
