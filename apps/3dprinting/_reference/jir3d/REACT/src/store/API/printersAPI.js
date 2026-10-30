import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  api_query,
  // credentials
} from "../../data/credentials";

const API_JIR3D = api_query();
export const printersApi = createApi({
  reducerPath: "printers",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_JIR3D}`,
    // baseUrl: `${credentials.API_JIR3D}`,
  }),

  endpoints: (builder) => ({
    getPrinters: builder.query({
      query: () => "/impresoras.php",
    }),
  }),
});
export const { useGetPrintersQuery } = printersApi;
