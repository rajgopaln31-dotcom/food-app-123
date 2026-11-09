import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../types";

interface CartState { items: CartItem[]; coupon: string; }
const initialState: CartState = { items: [], coupon: "" };
export const validCoupons = ["SAVE10", "FLAT50"];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const oldItem = state.items.find((item) => item.key === action.payload.key);
      if (oldItem) { oldItem.quantity += action.payload.quantity; }
      else { state.items.push(action.payload); }
    },
    changeQuantity(state, action: PayloadAction<{ key: string; change: number }>) {
      const item = state.items.find((cartItem) => cartItem.key === action.payload.key);
      if (item) { item.quantity += action.payload.change; }
      state.items = state.items.filter((cartItem) => cartItem.quantity > 0);
    },
    removeItem(state, action: PayloadAction<string>) { state.items = state.items.filter((item) => item.key !== action.payload); },
    clearCart(state) { state.items = []; state.coupon = ""; },
    setCoupon(state, action: PayloadAction<string>) { state.coupon = action.payload; },
  },
});

// Calculates subtotal, discount, delivery charge, tax and final total
export function getTotals(items: CartItem[], coupon: string) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  if (coupon === "SAVE10") discount = subtotal * 0.1;
  if (coupon === "FLAT50") discount = Math.min(50, subtotal);
  const delivery = subtotal > 0 ? 40 : 0;
  const tax = (subtotal - discount) * 0.05;
  const total = subtotal - discount + delivery + tax;
  return { subtotal, discount: Math.round(discount), delivery, tax: Math.round(tax), total: Math.round(total) };
}
export const { addToCart, changeQuantity, removeItem, clearCart, setCoupon } = cartSlice.actions;
export default cartSlice.reducer;
