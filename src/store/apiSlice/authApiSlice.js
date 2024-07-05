
import { apiSlice } from "../api";

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
                url: base + '/users/activation/',
                method: 'POST',
                body: data
            })
        }),
        forgotPassword: builder.mutation({
            query: (credentials) => ({
                url: base + '/users/reset_password/',
                method: 'GET',
                body: credentials
            })
        }),
        forgotPasswordReset: builder.mutation({
            query: (credentials) => ({
                url: base + '/users/reset_password_confirm/',
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


export const {
    useLoginMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useForgotPasswordMutation,
    useForgotPasswordResetMutation,
    useLogoutMutation,
    useRegisterMutation,
    useActivateAccountMutation
} = authApiSlice;

export const {
    endpoints: { login },
} = authApiSlice