import { UserState } from "@/interfaces"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const api = process.env.API_THINGIVERSE
const token = process.env.ACCESS_TOKEN_THINGIVERSE
const postsPerPage = 12
const config = {
    headers: { Authorization: `Bearer ${token}` }
};
// axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }

export const fetchThings = createAsyncThunk(
    'things/fetchThings',
    async ({ page, categoria }: UserState) => {
        try {
            let urlSearch = `${api}/search/${categoria || ""}/?per_page=${postsPerPage}&page=${page || 1}}`;
            // let urlSearch = `${credentials.API_THINGIVERSE
            //     }/search/${categoria}/?page=${page}&per_page=${thingiverse.postsPerPage}&${credentials.API_KEY_THINGIVERSE
            //     }&timestamp=${new Date().getTime()}`;
            const { data } = await axios.get(urlSearch, config)
            return data
            // return { action: "authorized", ...data }
        } catch (error: any) {
            return "error"
        }

    }
)