import { Form } from "@/hooks/useForm"
import { Tokens } from "@/interfaces"
import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { userAuthenticated, userDeAuthenticated } from "../slices/userSlice"
import { setAuthError } from "../slices/authSlice"
import { fetchThings } from "./thingsThunk"

const endpoint = process.env.API_JIR3D

export const formAuthentication = createAsyncThunk(
    'auth/formAuthentication',
    async (form: Form, { dispatch }) => {
        try {
            const { data } = await axios.post(`${endpoint}/auth`, form)
            if (data.user)
                dispatch(userAuthenticated(data))
            else
                dispatch(userDeAuthenticated(data))
            return data
        } catch (error: any) {
            const a = JSON.stringify(error.response.data)
            const data = JSON.parse(a)
            if (data.server || data.userName || data.password)
                dispatch(setAuthError(data))
            else
                dispatch(setAuthError({ server: "Network Error, contact Admin" }))
            return data
        }
    }
)
export const tokenAuthentication = createAsyncThunk(
    'auth/tokenAuthentication',
    async (tokens: Tokens, { dispatch }) => {
        try {
            const { data } = await axios.post(`${endpoint}/auth/verification`, tokens)
            if (data.user) {
                dispatch(userAuthenticated(data))
            }
            else
                dispatch(userDeAuthenticated(data))
            return data
        } catch (error: any) {
            const a = JSON.stringify(error.response.data)
            const data = JSON.parse(a)
            console.log(data)
            dispatch(userDeAuthenticated(data))
            return data
        }
    }
)
export const googleAuthentication = createAsyncThunk(
    'auth/googleAuthentication',
    async () => {
        try {
            // const { data } = await axios.post(`${endpoint}/auth/verification`, tokens)
            // if (data.user) {
            //     dispatch(userAuthenticated(data))
            // }
            // else
            //     dispatch(userDeAuthenticated(data))
            // return data
        } catch (error: any) {
            // const a = JSON.stringify(error.response.data)
            // const data = JSON.parse(a)
            // console.log(data)
            // dispatch(userDeAuthenticated(data))
            // return data
        }
    }
)

