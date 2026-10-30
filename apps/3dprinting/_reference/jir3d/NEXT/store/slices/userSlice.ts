import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppDispatch } from '../store';
import { formAuthentication, } from '../thunks/authThunk';
import {
    useSession, signIn, signOut
} from "next-auth/react"

const initialState: any = {
}

export const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // userSet: (state, action) => {
        //     return { ...action.payload }
        // },
        // userUnset: (state) => {
        //     return { lastPath: state.lastPath }
        // },
        userAuthenticated: (state, action) => {
            return { ...action.payload.user }
        },
        userDeAuthenticated: (state, action) => {
            // signOut()
            return {}
        },

    },
    extraReducers: (builder) => {
        builder.addCase(formAuthentication.fulfilled, (state, action) => {
        })
        builder.addCase(formAuthentication.rejected, (state) => {
        })
    },
})

// actions
export const {
    // userUnset,
    // userSet,
    userAuthenticated,
    userDeAuthenticated
} = userReducer.actions

// selectors
// export const isLoggedSelector = (state: RootState) => state.user.isLogged
// export const userSelector = (state: RootState) => state.user
export default userReducer.reducer