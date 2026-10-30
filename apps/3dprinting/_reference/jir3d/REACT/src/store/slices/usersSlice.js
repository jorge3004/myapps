import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      Object.assign(state, state.users, action.payload);
    },
    clearUsers: (state, action) => {
      state.users = {};
    },
  },
});

export const { setUsers, clearUsers } = usersSlice.actions;

export default usersSlice.reducer;
