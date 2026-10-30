import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { formAuthentication, tokenAuthentication } from '../thunks/authThunk';
import { AuthError, AuthState } from "@/interfaces";
import { userAuthenticated, userDeAuthenticated } from "./userSlice";
// import { setAuthError } from '@/store/slices/userSlice';

const initialTokens = () => {
    if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const status = !!accessToken && !!refreshToken
        !status && localStorage.clear()
        return status
            ? { accessToken, refreshToken, status }
            : { status }
    }
}

const initialState: AuthState = {
    tokens: initialTokens(),
    lastAction: "firstRun",
} as AuthState

export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthError: (state, action: PayloadAction<AuthError>) => {
            state.authError = action.payload
            state.lastAction = "authError"
        },
    },
    extraReducers: (builder) => {
        builder.addCase(formAuthentication.pending, (state, action) => {
            state.lastAction = "formAuthentication/pending"
        })
        builder.addCase(formAuthentication.fulfilled, (state, action) => {
            state.lastAction = "formAuthentication/fullfilled"
        })
        builder.addCase(formAuthentication.rejected, (state, action) => {
            state.lastAction = "formAuthentication/rejected"
        })
        builder.addCase(tokenAuthentication.pending, (state, action) => {
            state.lastAction = "tokenAuthentication/pending"
        })
        builder.addCase(tokenAuthentication.fulfilled, (state, action) => {
            state.lastAction = "tokenAuthentication/fullfilled"
        })
        builder.addCase(tokenAuthentication.rejected, (state, action) => {
            state.lastAction = "tokenAuthentication/rejected"
        })
        builder.addCase(userAuthenticated, (state, action) => {
            state.lastAction = "auth/userAuthenticated"
            if (action.payload.accessToken) {
                const { user, ...rest } = action.payload;
                state.tokens = { ...rest, status: true }
                localStorage.setItem('accessToken', rest.accessToken)
                localStorage.setItem('refreshToken', rest.refreshToken)
            }
            state.isAuthenticated = true
        })
        builder.addCase(userDeAuthenticated, (state, action: PayloadAction<any | null>) => {
            if (!action.payload?.user) {
                state.lastAction = "auth/userDeAuthenticated"
                state.tokens = { status: false }
                state.isAuthenticated = false
                if (action.payload?.server === "Access token not valid")
                    state.authError = { server: " Session expired" }
                else
                    state.authError = action.payload
                localStorage.clear()
            }
        })
    },
})

// actions
export const {
    setAuthError,
} = authReducer.actions

// selectors
// export const isLoggedSelector = (state: RootState) => state.user.isLogged
// export const userSelector = (state: RootState) => state.user
export default authReducer.reducer