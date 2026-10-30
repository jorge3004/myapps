import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppDispatch } from '../store';
import { formAuthentication, } from '../thunks/authThunk';
import { fetchThings } from "../thunks/thingsThunk";

const initialState: any = {
}

export const thingReducer = createSlice({
    name: 'thing',
    initialState,
    reducers: {
        // userAuthenticated: (state, action) => {
        //     return { ...action.payload.user }
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchThings.pending, (state, action) => {
        })
        builder.addCase(fetchThings.fulfilled, (state, action) => {
            return action.payload
        })
        builder.addCase(formAuthentication.rejected, (state) => {
        })
    },
})

// actions
export const {
    // userAuthenticated,
} = thingReducer.actions

// selectors
// export const isLoggedSelector = (state: RootState) => state.user.isLogged
// export const userSelector = (state: RootState) => state.user
export default thingReducer.reducer