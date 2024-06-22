
import { apiSlice } from "../api";

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
                url: base + `/${slug}/`,
                method: 'GET',
            })
        }),
        getAllWishList: builder.query({
            query: () => ({
                url: base + `/wishlist/`,
                method: 'GET',
            })
        }),
        getReview: builder.query({
            query: (id) => ({
                url: base + `/review/${id}/`,
                method: 'GET',
            })
        }),
        deleteFromWishList: builder.mutation({
            query: (id) => ({
                url: base + `/wishlist/`,
                method: 'PUT',
                body: { product: id }
            })
        }),
        addToWishList: builder.mutation({
            query: (id) => ({
                url: base + `/wishlist/`,
                method: 'Post',
                body: { product: id }
            })
        })
    })
})

export const {
    useGetAllProductsQuery,
    useGetSingleProductQuery,
    useGetAllWishListQuery,
    useDeleteFromWishListMutation,
    useAddToWishListMutation,
    useGetReviewQuery
} = productApiSlice;
