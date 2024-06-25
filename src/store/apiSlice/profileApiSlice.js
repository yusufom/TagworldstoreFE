
import {apiSlice} from "../api";

const base = "account"


export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateProfile: builder.mutation({
            query: (credentials) => ({
                url: base + '/',
                method: 'PUT',
                body: credentials,
            })
        }),
        getProfile: builder.query({
            query: () => ({
                url: base + '/',
                method: 'GET',
                
            })
        }),
    })
})


export const {
    useUpdateProfileMutation,
    useGetProfileQuery
} = profileApiSlice;
