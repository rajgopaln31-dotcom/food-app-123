import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../types";

const initialState: { orders: Order[] } = { orders: [] };

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) { state.orders.unshift(action.payload); }, // newest first
  },
});
export const { addOrder } = orderSlice.actions;
export default orderSlice.reducer;
