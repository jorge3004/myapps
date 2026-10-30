import { googleLogout } from '@react-oauth/google';
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      try {
        if (!!localStorage.getItem("correo") && (window.google.accounts?.id !== undefined)) {
          googleLogout()
          google.accounts.id.revoke(localStorage.getItem("correo"))
          google.accounts.id.disableAutoSelect();
        }
        localStorage.clear()
        Object.assign(state, { verified: false });
      } catch (e) {
        console.log(e);
        state.user = { verified: false };
        localStorage.clear()
      }
    },
    setAuth: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { logOut, setAuth } = authSlice.actions;

export default authSlice.reducer;
