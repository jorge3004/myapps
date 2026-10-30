import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tmp: 'data',
  util: {
    verification: false,
    loading: false
  },
};

export const utilSlice = createSlice({
  name: "util",
  initialState,
  reducers: {
    setModal: (state, action) => {
      state.util = {
        ...state.util,
        modal: { ...action.payload },
      };
    },
    setEnvironment: (state, action) => {
      state.util = {
        ...state.util,
        env: action.payload,
      };
    },
    setTemp: (state, action) => {
      state.util = {
        ...state.util,
        env: action.payload,
      };
    },
    setLoading: (state, action) => {
      state.util = {
        ...state.util,
        modal: action.payload,
      };
    },
    setPrintersStatus: (state, action) => {
      state.util = {
        ...state.util,
        printersStatus: {
          ...state.util.printersStatus,
          ...action.payload
        },
      };
    },
    setImpresion: (state, action) => {
      state.util = {
        ...state.util,
        impresion: {
          ...state.util.impresion,
          ...action.payload
        },
      };
    },
    clearImpresion: (state) => {
      delete state.util.impresion

    },
    setPrinterGStatus: (state, action) => {
      state.util = {
        ...state.util,
        printerGStatus: {
          ...state.util.printerGStatus,
          ...action.payload
        },
      };
    },
    setPrintersGStatus: (state, { payload }) => {
      state.util = {
        ...state.util,
        printersGStatus: payload
      };
    },
    deletePrinterStatus: (state, { payload }) => {
      if (Object.keys(state.util.printersStatus).length <= 1)
        delete state.util.printersStatus
      else
        delete state.util.printersStatus[payload]
    },
    deletePrinterGStatus: (state, { payload }) => {
      if (Object.keys(state.util.printersGStatus).length <= 1)
        delete state.util.printersGStatus
      else
        delete state.util.printersGStatus[payload]
    },
    setOperation: (state, action) => {
      state.util = {
        ...state.util,
        operations: { ...action.payload },
      };
    },
    updateModal: (state, action) => {
      state.util = {
        ...state.util,
        modal: { ...state.util.modal, ...action.payload },
      };
    },
    clearOperation: (state) => {
      delete state.util.operation
    },
    activateDropdown: (state, action) => {
      state.util = {
        ...state.util,
        dropdown: { ...action.payload },
      };
    },
    activateThingiverseWait: (state) => {
      state.util = {
        thingiverseWait: true,
      };
    },
    clearThingiverseWait: (state) => {
      state.util = {
        ...state.util,
        thingiverseWait: false,
      };
    },
    clearUtil: (state) => {
      delete state.util.util
    },
    setAuthentification: (state) => {
      state.util = {
        authentification: false,
      };
    },
    setAuthentificationError: (state, action) => {
      state.util = {
        error_authentification: action.payload,
        verified: false
      };
    },
    setVerification: (state) => {
      state.util = {
        verification: false,
      };
    },
    setVerificationError: (state, action) => {
      state.util = {
        error_verification: action.payload,
      };
    },
    setIntervalo: (state, action) => {
      state.util = {
        ...state.util,
        intervalo: action.payload,
      };
    },
    setPrice: (state, action) => {
      state.util = {
        ...state.util,
        price: action.payload,
      };
    },
    clearModal: (state) => {
      delete state.util.modal
    },
    clearDropdown: (state) => {
      delete state.util.dropdown
    },
    thingLoading: (state, { payload }) => {
      state.util = {
        ...state.util,
        thingLoading: payload,
      };
    },
    clearThingLoading: (state) => {
      delete state.util.thingLoading
    },

  },
});

export const {
  thingLoading,
  clearThingLoading,
  setModal,
  updateModal,
  setOperation,
  clearOperation,
  activateDropdown,
  activateThingiverseWait,
  clearThingiverseWait,
  clearUtil,
  setAuthentification,
  setVerification,
  setAuthentificationError,
  setVerificationError,
  setIntervalo,
  clearModal,
  setPrice,
  clearDropdown,
  setPrintersStatus,
  deletePrinterStatus,
  setPrinterGStatus,
  deletePrinterGStatus,
  setPrintersGStatus,
  setImpresion,
  clearImpresion,
  setLoading,
  setEnvironment
} = utilSlice.actions;

export default utilSlice.reducer;
