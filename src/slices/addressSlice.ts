import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "../types";

interface AddressState { addresses: Address[]; selectedId: number | null; }
const initialState: AddressState = { addresses: [], selectedId: null };

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
      if (state.selectedId === null) state.selectedId = action.payload.id; // first address becomes default
    },
    updateAddress(state, action: PayloadAction<Address>) {
      state.addresses = state.addresses.map((a) => (a.id === action.payload.id ? action.payload : a));
    },
    deleteAddress(state, action: PayloadAction<number>) {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
      if (state.selectedId === action.payload) state.selectedId = state.addresses.length > 0 ? state.addresses[0].id : null;
    },
    selectAddress(state, action: PayloadAction<number>) { state.selectedId = action.payload; },
  },
});
export const { addAddress, updateAddress, deleteAddress, selectAddress } = addressSlice.actions;
export default addressSlice.reducer;
