import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { ids: number[] } = { ids: [] };

const favouriteSlice = createSlice({
  name: "favourite",
  initialState,
  reducers: {
    toggleFavourite(state, action: PayloadAction<number>) {
      if (state.ids.includes(action.payload)) { state.ids = state.ids.filter((id) => id !== action.payload); }
      else { state.ids.push(action.payload); }
    },
  },
});
export const { toggleFavourite } = favouriteSlice.actions;
export default favouriteSlice.reducer;
