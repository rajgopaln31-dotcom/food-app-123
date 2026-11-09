import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import cartReducer from './slices/cartSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import favouriteReducer from './slices/favouriteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    favourite: favouriteReducer,
  },
});

// Save registered users in LocalStorage
store.subscribe(() => {
  const users = store.getState().auth.users;
  localStorage.setItem('foodie_users', JSON.stringify(users));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;