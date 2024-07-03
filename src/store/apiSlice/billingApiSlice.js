import { apiSlice } from "../api";

const base = "billing";

export const billingApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createBillingAddress: builder.mutation({
            query: (credentials) => ({
                url: `${base}/`,
                method: 'POST',
                body: credentials,
            })
        }),
        getAllBillingAddresses: builder.query({
            query: () => ({
                url: `${base}/`,
                method: 'GET'
            })
        }),
        updateBillingAddress: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `${base}/${id}/update_address/`,
                method: 'PUT',
                body: data,
            })
        }),
        deleteBillingAddress: builder.mutation({
            query: (id) => ({
                url: `${base}/${id}/delete_address/`,
                method: 'DELETE',
            })
        })
    })
});

export const {
    useCreateBillingAddressMutation,
    useGetAllBillingAddressesQuery,
    useUpdateBillingAddressMutation,
    useDeleteBillingAddressMutation,
} = billingApiSlice;
