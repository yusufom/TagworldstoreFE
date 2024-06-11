
import {apiSlice} from "../api";

const base = "products"


export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllProducts: builder.query({
            query: () => ({
                url: base + '/',
                method: 'GET',
            })
        })
    })
})

export const {
    useGetAllProductsQuery
} = productApiSlice;
