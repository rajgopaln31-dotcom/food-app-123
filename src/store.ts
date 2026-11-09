import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import restaurantReducer from "./slices/restaurantSlice";
import cartReducer from "./slices/cartSlice";
import addressReducer from "./slices/addressSlice";
import orderReducer from "./slices/orderSlice";
import favouriteReducer from "./slices/favouriteSlice";

// Load saved data from the browser, so users, cart and orders are not lost on refresh
const savedState = localStorage.getItem("foodAppState");

export const store = configureStore({
  reducer: { auth: authReducer, restaurant: restaurantReducer, cart: cartReducer, address: addressReducer, order: orderReducer, favourite: favouriteReducer },
  preloadedState: savedState ? JSON.parse(savedState) : undefined,
});

// Save the data every time it changes
store.subscribe(() => localStorage.setItem("foodAppState", JSON.stringify(store.getState())));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
