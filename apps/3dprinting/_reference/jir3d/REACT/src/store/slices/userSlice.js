import { googleLogout } from '@react-oauth/google';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      Object.assign(state, state.user, action.payload);
      // state.user = { ...action.payload, };
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
