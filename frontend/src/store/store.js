import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './CartSlice';
import authReducer from './authSlice';

//  LocalStorage se state load karna
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("cartState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

//  LocalStorage me state save karna
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cartState", serializedState);
  } catch(err) {
    console.error("Could not save state", err);
  }
};


const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
    },
    preloadedState: {
    cart: loadState() || undefined, // LocalStorage ka data load karna
  },
});

//  Har state change ke baad localStorage update karna
store.subscribe(() => {
  saveState(store.getState().cart);
});

export default store;