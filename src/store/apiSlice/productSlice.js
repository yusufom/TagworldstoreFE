
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
                url: base + `/wishlist/list/`,
                method: 'GET',
            })
        }),
        getReview: builder.query({
            query: (id) => ({
                url: base + `/review/${id}/`,
                method: 'GET',
            })
        }),
        getSlides: builder.query({
            query: () => ({
                url: base + `/slides/views/`,
                method: 'GET',
            })
        }),
        addReview: builder.mutation({
            query: (data) => ({
                url: base + `/review/create/`,
                method: 'POST',
                body: data
            })
        }),
        deleteFromWishList: builder.mutation({
            query: (id) => ({
                url: base + `/wishlist/update/`,
                method: 'PUT',
                body: { product: id }
            })
        }),
        clearWishList: builder.mutation({
            query: (id) => ({
                url: base + `/wishlist/clear/`,
                method: 'PUT',
                body: { product: "id" }
            })
        }),
        addToWishList: builder.mutation({
            query: (id) => ({
                url: base + `/wishlist/create/`,
                method: 'POST',
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
    useGetReviewQuery,
    useAddReviewMutation,
    useGetSlidesQuery,
    useClearWishListMutation,
    usePrefetch,
    
} = productApiSlice;
