import React from "react";
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

  const handleIncrease = (product) => {
    dispatch(addToCart(product));
  };

  const handleDecrease = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // ✅ New: Order Now handler
  const handleOrderNow = () => {
    if (cart.totalItems > 0) {
      alert("🎉 Order placed successfully!");
      dispatch(clearCart());
    } else {
      alert("Cart is empty!");
    }
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
          <Link
            to="/"
            className="inline-block mt-12"
          >
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
            <div key={item.product._id} className="flex items-center my-8">
              <img
                className="w-24"
                src={item.product.image}
                alt={item.product.name}
              />
              <div className="flex-1 ml-4">
                <h1>{item.product.name}</h1>
                <span>{item.product.size}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDecrease(item.product._id)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity} Pcs</span>
                <button
                  onClick={() => handleIncrease(item.product)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <span className="font-bold text-lg ml-4">
                ₹ {item.product.price * item.quantity}
              </span>
              <button
                onClick={() => handleRemove(item.product._id)}
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <hr />
        <div className="text-right py-4">
          <div>
            <span className="text-lg font-bold">Total Amount:</span>
            <span className="amount text-2xl font-bold ml-2">
              ₹ {totalPrice}
            </span>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleClearCart}
              className="px-6 py-2 rounded-full border border-gray-400 font-bold"
            >
              Clear Cart
            </button>
            {/* Order Now button */}
            <button
              onClick={handleOrderNow}
              className="px-6 py-2 rounded-full bg-[#FE5F1E] hover:bg-[#e64e10] text-white font-bold transition duration-300"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
