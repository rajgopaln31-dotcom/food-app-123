import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Search text, selected category, sort option and delivery location are shared by Home and Restaurants pages
interface RestaurantState { search: string; category: string; sort: string; location: string; }
const initialState: RestaurantState = { search: "", category: "All", sort: "none", location: "Hyderabad" };

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) { state.search = action.payload; },
    setCategory(state, action: PayloadAction<string>) { state.category = action.payload; },
    setSort(state, action: PayloadAction<string>) { state.sort = action.payload; },
    setLocation(state, action: PayloadAction<string>) { state.location = action.payload; },
  },
});
export const { setSearch, setCategory, setSort, setLocation } = restaurantSlice.actions;
export default restaurantSlice.reducer;
