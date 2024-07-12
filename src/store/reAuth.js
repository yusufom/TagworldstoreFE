import { Mutex } from 'async-mutex'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { warningToast } from '../helpers/toast'
import { authenticate, unauthenticate } from './slices/auth-slice'



const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}`,
    credentials: 'same-origin',
    // credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState()).auth.access
        if (accessToken) {
            headers.set('authorization', `JWT ${accessToken}`)
        }
        return headers
    },
})



export const baseQueryWithReauth = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)
    const refreshToken = (api.getState()).auth.refresh
    if (result.error && result.error.status === 401) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try {
                const refreshResult = await baseQuery(
                    {
                        url: 'auth/jwt/refresh/',
                        method: 'POST',
                        body: { 'refresh': refreshToken || '' }
                    },
                    api,
                    extraOptions
                )
                if (refreshResult.data) {
                    api.dispatch(authenticate(refreshResult.data))
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    // warningToast("Please login to perform this action")
                    api.dispatch(unauthenticate())
                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}