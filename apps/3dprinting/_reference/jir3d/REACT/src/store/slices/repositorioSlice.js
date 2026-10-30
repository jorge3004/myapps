import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  repositorio: {},
};

export const repositorioSlice = createSlice({
  name: "repositorio",
  initialState,
  reducers: {
    repositorioLoading: (state, action) => {
      state.repositorio = {
        ...state.repositorio,
        ...action.payload,
        loading: true,
        state: "Fetching",
      };
    },
    setRepositorio: (state, action) => {
      state.repositorio = {
        // ...state.repositorio,
        ...action.payload,
        // loading: false,
        // state: "Fetched",
      };
    },
    clearRepositorio: (state) => {
      state.repositorio = {};
    },
  },
});
export const { repositorioLoading, setRepositorio, clearRepositorio } =
  repositorioSlice.actions;
export default repositorioSlice.reducer;
