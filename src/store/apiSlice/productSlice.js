
import {apiSlice} from "../api";

const base = "products"


export const productApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getAllProducts: builder.query({
            query: () => ({
                url: base + '/',
                method: 'GET',
            })
        }),
        getSingleProduct: builder.query({
            query: (slug) => ({
                url: base + `/${slug}`,
                method: 'GET',
            })
        })
    })
})

export const {
    useGetAllProductsQuery,
    useGetSingleProductQuery,
} = productApiSlice;
