import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scripts: {},
};

export const scriptsSlice = createSlice({
  name: "scripts",
  initialState,
  reducers: {
    setScripts: (state, action) => {
      state.scripts = {
        state: action.payload,
      };
    },
  },
});
export const { setScripts } = scriptsSlice.actions;
export default scriptsSlice.reducer;
