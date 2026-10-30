import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  impresoras: {},
};

export const impresorasSlice = createSlice({
  name: "impresoras",
  initialState,
  reducers: {
    setImpresoras: (state, { payload }) => {
      state.impresoras = {
        ...payload,
      };
    },
    updateImpresoras: (state, action) => {
      state.impresoras = {
        ...state.impresoras,
        ...action.payload,
      };
    },
    loadingImpresora: (state, action) => {
      state.impresoras = {
        ...state.impresoras,
        ...action.payload,
        state: "Fetching",
      };
    },
    setErrorImpresora: (state, action) => {
      state.impresoras = {
        ...state.impresoras,
        modal: {
          ...state.impresoras.modal,
          errorMsg: action.payload,
        },
        state: "Setting errorMsg",
      };
    },
    setImpresorasWithInterval: (state, action) => {
      state.impresoras = {
        ...state.impresoras,
        ...action.payload,
        state: "Fetched/Interval set",
      };
    },
    setTmpPrinter: (state, action) => {
      state.impresoras = {
        ...state.impresoras,
        ...action.payload,
        state: "Setting temp printer",
      };
    },
    erasePrinterData: (state) => {
      state.impresoras = {
        state: "Exit component",
      };
    },
    clearImpresoras: (state) => {
      state.impresoras = {};
    },
  },
});
export const {
  loadingImpresora,
  setImpresoras,
  setErrorImpresora,
  setImpresorasWithInterval,
  setTmpPrinter,
  toggleImpresaDropDown,
  erasePrinterData,
  updateImpresoras,
  clearImpresoras,
} = impresorasSlice.actions;

export default impresorasSlice.reducer;
