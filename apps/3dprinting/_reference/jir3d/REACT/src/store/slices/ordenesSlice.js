import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ordenes: {
    // loading: true,
    // state: "initial",
    // location: null,
    // ordenes: null,
  },
};

export const ordenesSlice = createSlice({
  name: "ordenes",
  initialState,
  reducers: {
    setOrdenes: (state, action) => {
      state.ordenes = {
        // ...state.ordenes,
        ...action.payload,
        // state: "fetched",
        // loading: false,
      };
    },
    loadingOrdenes: (state, action) => {
      state.ordenes = {
        ...state.ordenes,
        ...action.payload,
        state: "fetching",
        loading: true,
      };
    },
    clearOrdenes: (state, action) => {
      state.ordenes = {};
    },
  },
});
export const { setOrdenes, loadingOrdenes, clearOrdenes } =
  ordenesSlice.actions;
export default ordenesSlice.reducer;
