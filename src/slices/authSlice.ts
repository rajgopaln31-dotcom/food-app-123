import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

interface AuthState { users: User[]; currentUser: User | null; }
const initialState: AuthState = { users: [], currentUser: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser(state, action: PayloadAction<User>) { state.users.push(action.payload); },
    loginUser(state, action: PayloadAction<User>) { state.currentUser = action.payload; },
    logoutUser(state) { state.currentUser = null; },
  },
});
export const { registerUser, loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
