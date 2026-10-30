import { createSlice } from "@reduxjs/toolkit";
import { phoneModeLimit } from "../../data/initializations";

const isPhoneMode = () => {
  if (window.innerWidth < phoneModeLimit) return true;
  else return false;
};

const initialState = {
  screenSize: {
    width: window.innerWidth,
    hight: window.innerHeight,
    isPhoneMode: isPhoneMode(),
  },
};

export const screenSizeSlice = createSlice({
  name: "screenSize",
  initialState,
  reducers: {
    setScreenSize: (state) => {
      state.screenSize = {
        width: window.innerWidth,
        hight: window.innerHeight,
        isPhoneMode: isPhoneMode(),
      };
    },
  },
});
export const { setScreenSize } = screenSizeSlice.actions;
export default screenSizeSlice.reducer;
