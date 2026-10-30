import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carrito: {
    // loading: true,
    // status: "initial",
    // location: null,
    // carrito: null,
    // carritoTemp: { viewMain: true },
  },
};

export const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    setCarrito: (state, action) => {
      state.carrito = {
        ...action.payload,
      };
    },
    clearCarrito: (state) => {
      state.carrito = {};
    },
    setCarritoTmp: (state, action) => {
      state.carrito = {
        ...state.carrito,
        ...action.payload,
        status: "fetched",
        loading: false,
      };
    },
    activateCarritoMainView: (state, action) => {
      state.carrito = {
        ...state.carrito,
        ...action.payload,
        carritoTemp: { viewMain: true },
      };
    },
    deactivateCarritoMainView: (state, action) => {
      state.carrito = {
        ...state.carrito,
        carritoTemp: { ...action.payload, viewMain: false },
      };
    },
    carritoLoading: (state, action) => {
      state.carrito = {
        ...state.carrito,
        ...action.payload,
        loading: true,
        status: "fetching",
        carritoTemp: { viewMain: true },
      };
    },
  },
});

export const {
  setCarrito,
  setCarritoTmp,
  carritoLoading,
  activateCarritoMainView,
  deactivateCarritoMainView,
  clearCarrito,
} = carritoSlice.actions;

export default carritoSlice.reducer;
