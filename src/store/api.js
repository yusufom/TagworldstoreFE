import {createApi} from '@reduxjs/toolkit/query/react'
import {baseQueryWithReauth} from './reAuth'


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})
