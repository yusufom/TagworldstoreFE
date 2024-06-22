import { createSlice } from '@reduxjs/toolkit'
// import { authApiSlice } from '../apiSlice/authApiSlice';


const authInitialState = {
    isAuthenticated: false,
    isLoading: false,
    access: null,
    refresh: null
};


const authSlice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        authenticate: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.access = action.payload.access;
            state.refresh = action.payload.refresh;
        },
        unauthenticate: state => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.access = null;
            state.refresh = null;
        },
        completeLoading: state => {
            state.isLoading = false;
        }

    },
    // extraReducers: (builder) => {
    //     builder
    //         .addMatcher(authApiSlice.endpoints.login.matchPending, (state, action) => {
    //             state.isLoading = true;
    //         })
    //         .addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
    //             state.isAuthenticated = true;
    //             state.isLoading = false;
    //             state.access = action.payload.access;
    //             state.refresh = action.payload.refresh;
    //         })
    //         .addMatcher(authApiSlice.endpoints.login.matchRejected, (state, action) => {
    //             state.isAuthenticated = false;
    //             state.isLoading = false;
    //             state.access = null;
    //             state.refresh = null;
    //         })
    // },
})


export const { authenticate, unauthenticate, completeLoading } = authSlice.actions
export default authSlice.reducer