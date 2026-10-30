import { configureStore } from "@reduxjs/toolkit";
// import { printersApi } from './API/printersAPI';
import carritoSlice from "./slices/carritoSlice";
import impresorasSlice from "./slices/impresorasSlice";
import thingiverseSlice from "./slices/thingiverseSlice";
import repositorioSlice from "./slices/repositorioSlice";
import userSlice from "./slices/userSlice";
import usersSlice from "./slices/usersSlice";
import ordenesSlice from "./slices/ordenesSlice";
import screenSizeSlice from "./slices/screenSlice";
import utilSlice from "./slices/utilSlice";
import scriptsSlice from "./slices/scriptsSlice";
import authSlice from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    auth: authSlice,
    users: usersSlice,
    // carrito: carritoSlice,
    // thingiverse: thingiverseSlice,
    // impresoras: impresorasSlice,
    // repositorio: repositorioSlice,
    // scripts: scriptsSlice,
    // ordenes: ordenesSlice,
    // screenSize: screenSizeSlice,
    // util: utilSlice,
    // [printersApi.reducerPath]: printersApi.reducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(printersApi.middleware)
});
