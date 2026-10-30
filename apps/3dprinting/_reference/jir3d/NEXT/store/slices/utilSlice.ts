import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { authentication, verification } from '../thunks/userThunk';

// export interface AuthError {
//     [prop: string]: string

// }

export interface UtilState {
    isLogged: boolean
}
const initialState = {
    // isLogged: true,
} as UtilState


export const utilReducer = createSlice({
    name: 'util',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<UtilState>) => {

        }
    },
    extraReducers: (builder) => {
        // builder.addCase(authentication.pending, (state) => {
        //     state.loading = true
        // })
    },
})

// actions
export const { setLoading } = utilReducer.actions

// selectors
// export const isLoggedSelector = (state: RootState) => state.user.isLogged
// export const userSelector = (state: RootState) => state.util
export default utilReducer.reducer