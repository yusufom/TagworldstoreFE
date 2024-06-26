
import {apiSlice} from "../api";

const base = "auth"


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: base + '/jwt/create',
                method: 'POST',
                body: credentials,
            })
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: base + '/users/',
                method: 'POST',
                body: credentials
            })
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/signout/',
                method: 'POST'
            })
        }),
        deleteAccount: builder.mutation({
            query: () => ({
                url: '/me/delete/',
                method: 'DELETE'
            })
        }),
        activateAccount: builder.mutation({
            query: (data) => ({
                url: '/users/activation/',
                method: 'POST',
                body: data
            })
        }),
        forgotUsernamePassword: builder.mutation({
            query: (credentials) => ({
                url: '/auth/influencer/password_request/',
                method: 'GET',
                body: credentials
            })
        }),
        changePassword: builder.mutation({
            query: (credentials) => ({
                url: base + '/users/set_password/',
                method: 'POST',
                body: credentials
            })
        }),
    })
})


// export const { useGetUserQuery, useLoginMutation, useCheckCodeMutation, useChangePasswordMutation, useDeleteAccountMutation, useForgotUsernamePasswordMutation, useLogoutMutation, useRegisterMutation } = authApiSlice;
export const {
    useLoginMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useForgotUsernamePasswordMutation,
    useLogoutMutation,
    useRegisterMutation,
    useActivateAccountMutation
} = authApiSlice;

export const {
    endpoints: {login},
} = authApiSlice