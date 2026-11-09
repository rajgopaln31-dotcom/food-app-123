import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice';
import restaurantReducer from './features/restaurant/restaurantSlice';
import cartReducer from './features/cart/cartSlice';
import addressReducer from './features/address/addressSlice';
import orderReducer from './features/order/orderSlice';
import favouriteReducer from './features/favourite/favouriteSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  cart: cartReducer,
  address: addressReducer,
  order: orderReducer,
  favourite: favouriteReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;