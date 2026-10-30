import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  thingiverse: {},
};

export const thingiverseSlice = createSlice({
  name: "thingiverse",
  initialState,
  reducers: {
    setThings: (state, action) => {
      state.thingiverse = {
        ...action.payload,
        loading: false,
      };
    },
    clearThings: (state) => {
      state.thingiverse = {};
    },
    loadingThings: (state) => {
      state.thingiverse = {
        ...state.thingiverse,
        loading: true,
      };
    },
    setThingsError: (state) => {
      state.thingiverse = {
        ...state.thingiverse,
        error: true,
        loading: false,
      };
    },
  },
});
export const { setThings, loadingThings, setThingsError, clearThings } =
  thingiverseSlice.actions;
export default thingiverseSlice.reducer;
