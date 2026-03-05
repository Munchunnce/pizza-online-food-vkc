import { createSlice } from "@reduxjs/toolkit";

const CartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},      // { productId: { product: {...}, quantity: number } }
    totalItems: 0,  // total items in cart
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;

      if (!state.items) state.items = {};

      if (state.items[product._id]) {
        state.items[product._id].quantity += 1; // quantity increase
      } else {
        state.items[product._id] = { product, quantity: 1 }; // new product
      }

      if (!state.totalItems) state.totalItems = 0;
      state.totalItems += 1;
    },

    removeFromCart(state, action) {
      const productId = action.payload;

      if (state.items[productId]) {
        state.totalItems -= state.items[productId].quantity; // subtract total
        delete state.items[productId]; // remove product
      }
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;

      if (state.items[productId]) {
        if (state.items[productId].quantity > 1) {
          state.items[productId].quantity -= 1;
          state.totalItems -= 1;
        } else {
          // if quantity = 1, remove product
          state.totalItems -= 1;
          delete state.items[productId];
        }
      }
    },

    clearCart(state) {
      state.items = {};
      state.totalItems = 0;
      // LocalStorage clear bhi karo
      localStorage.removeItem("cartState");
    },
  },
});


export const { addToCart, removeFromCart, decreaseQuantity, clearCart } = CartSlice.actions;
export default CartSlice.reducer;
