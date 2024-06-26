import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from './api';
import {
    persistStore,
    persistReducer,
    // FLUSH,
    // REHYDRATE,
    // PAUSE,
    // PERSIST,
    // PURGE,
    // REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import productReducer from './slices/product-slice';
import currencyReducer from "./slices/currency-slice";
import cartReducer from "./slices/cart-slice";
import compareReducer from "./slices/compare-slice";
import wishlistReducer from "./slices/wishlist-slice";
import userReducer from "./slices/user-slice";
import authReducer from "./slices/auth-slice";

import { cartApiSlice } from './apiSlice/cartApiSlice';

const persistConfig = {
    key: "@#",
    version: 1.1,
    storage,
    blacklist: ["product", "api", 'compare', 'user']
}

export const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    [cartApiSlice.reducerPath]: cartApiSlice.reducer,
    auth: authReducer,
    user: userReducer,
    product: productReducer,
    currency: currencyReducer,
    cart: cartReducer,
    compare: compareReducer,
    wishlist: wishlistReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
            // serializableCheck: {
            //     ignoredActions: [
            //         FLUSH,
            //         REHYDRATE,
            //         PAUSE,
            //         PERSIST,
            //         PURGE,
            //         REGISTER,
            //     ],
            // },
        }).concat(apiSlice.middleware, cartApiSlice.middleware),
    devTools: false,
});

export const persistor = persistStore(store);