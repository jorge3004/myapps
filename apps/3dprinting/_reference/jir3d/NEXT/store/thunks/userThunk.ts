import { Form } from "@/hooks/useForm"
import { Tokens } from "@/interfaces"
import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { userAuthenticated, userDeAuthenticated } from "../slices/userSlice"
import { setAuthError } from "../slices/authSlice"

const endpoint = process.env.API_JIR3D

export const editUser = createAsyncThunk(
    'user/edit',
    async (user: any, { dispatch }) => {
        try {
            const { data } = await axios.post(`${endpoint}/user`, user)
            console.log(data)
            // if (data.user)
            //     dispatch(userAuthenticated(data))
            // else
            //     dispatch(userDeAuthenticated(data))
            return "data"
        } catch (error: any) {
            // const a = JSON.stringify(error.response.data)
            // const data = JSON.parse(a)
            // if (data.server || data.uname || data.pwd)
            //     dispatch(setAuthError(data))
            // else
            //     dispatch(setAuthError({ server: "Network Error, contact Admin" }))
            return "data"
        }
    }
)

