import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import userReducer from "./slices/userSlice"
import authReducer from "./slices/authSlice"
import thingReducer from "./slices/thingSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        thing: thingReducer,
    }
})

// create types for state and dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
