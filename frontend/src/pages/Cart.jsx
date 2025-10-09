import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/CartSlice";
import { Link, useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentType, setPaymentType] = useState("cod");
  const navigate = useNavigate();

  const totalPrice = Object.values(cart.items).reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const stripe = useStripe();
  const elements = useElements();

  const handleIncrease = (product) => dispatch(addToCart(product));
  const handleDecrease = (productId) => {
    const item = cart.items[productId];
    if (item && item.quantity > 1) dispatch(decreaseQuantity(productId));
  };
  const handleRemove = (productId) => dispatch(removeFromCart(productId));
  const handleClearCart = () => dispatch(clearCart());

  const handleOrderNow = async () => {
    if (cart.totalItems === 0) return alert("Cart is empty!");
    if (!phone || !address) return alert("Please enter phone & address!");

    const token = localStorage.getItem("access_token");
    if (!token) return alert("Please login first!");

    let stripeToken = null;

    if (paymentType === "card") {
      const cardElement = elements.getElement(CardElement);
      const { token: stripeResponseToken, error } = await stripe.createToken(cardElement);
      if (error) return alert(error.message);
      stripeToken = stripeResponseToken.id;
    }

    const orderData = {
      items: cart.items,
      totalItems: cart.totalItems,
      totalPrice,
      phone,
      address,
      paymentType,
      stripeToken,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("🎉 Order placed successfully!");
        dispatch(clearCart());
        setPhone("");
        setAddress("");
        navigate("/customer/orders");
      } else {
        alert(data.message || "Order failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  if (!cart.totalItems) {
    return (
      <div className="empty-cart py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Cart Empty 😕</h1>
          <p className="text-gray-500 text-lg mb-12">
            You probably haven't ordered a pizza yet. <br />
            To order a pizza, go to the main page.
          </p>
          <img className="w-2/5 mx-auto" src="/images/empty-cart.png" alt="empty-cart" />
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

        {/* Pizza Items */}
        {Object.values(cart.items).map((item) => (
          <div
            key={item.product._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 p-4 border rounded-lg shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto">
              <img
                className="w-24 h-24 object-cover rounded mx-auto sm:mx-0"
                src={item.product.image}
                alt={item.product.name}
              />
              <div className="flex-1 sm:ml-4 text-center sm:text-left mt-3 sm:mt-0">
                <h1 className="font-semibold text-lg">{item.product.name}</h1>
                <span className="text-gray-600 text-sm">{item.product.size}</span>
              </div>
            </div>

            <div className="flex items-center justify-center mt-3 sm:mt-0 space-x-2">
              <button
                onClick={() => handleDecrease(item.product._id)}
                disabled={item.quantity === 1}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  item.quantity === 1
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

        <hr />

        {/* Total + Payment Type + Inputs */}
        <div className="flex justify-end py-6">
          <div className="flex flex-col space-y-4 w-full md:w-1/3">
            <div className="text-left">
              <span className="text-lg font-bold">Total Amount:</span>
              <span className="amount text-2xl font-bold ml-2">₹ {totalPrice}</span>
            </div>

            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="block w-full border border-gray-400 px-4 py-2 rounded"
            >
              <option value="cod">Cash on delivery</option>
              <option value="card">Pay with card</option>
            </select>

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

            {paymentType === "card" && (
              <div className="mt-3 border border-gray-400 rounded p-2">
                <CardElement options={{ hidePostalCode: true }} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button onClick={handleClearCart} className="border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white px-6 py-2 rounded-full font-bold">
            Clear Cart
          </button>
          <button onClick={handleOrderNow} className="px-6 py-2 rounded-full bg-[#FE5F1E] hover:bg-[#e64e10] text-white font-bold">
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;
