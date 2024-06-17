
import {apiSlice} from "../api";

const base = "orders/cart"


export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        addToCart: builder.mutation({
            query: (data) => ({
                url: base + '/',
                method: 'POST',
                body: data,
            })
        }),
        getAllCartItems: builder.query({
            query: () => ({
                url: base + '/',
                method: 'GET',
            })
        }),
        deleteFromCart: builder.mutation({
            query: (id) => ({
                url: base + '/' + id + '/',
                method: 'DELETE',
            })
        }),
        decreaseQuantity: builder.mutation({
            query: (id) => ({
                url: base + '/' + id + '/decrease_quantity/',
                method: 'PUT',
            })
        }),
        deleteAllFromCart: builder.query({
            query: (slug) => ({
                url: base + `/${slug}`,
                method: 'GET',
            })
        })
    })
})

export const {
    useAddToCartMutation, useGetAllCartItemsQuery, useDeleteFromCartMutation, useDecreaseQuantityMutation
} = cartApiSlice;
