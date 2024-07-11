
import cogoToast from 'cogo-toast';
import { cartApiSlice } from '../apiSlice/cartApiSlice';
import { errorToast } from '../../helpers/toast';
const { createSlice } = require('@reduxjs/toolkit');

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        isLoading: false,
        cartItems: []
    },
    reducers: {
        addToCart(state, action) {
            const product = action.payload.product;
            const cartItemData = action.payload
            if (!product?.variation) {
                const cartItem = state.cartItems.find(item => item.id === cartItemData.id);
                if (!cartItem) {
                    state.cartItems.push({
                        product: product,
                        quantity: cartItemData.quantity ? cartItemData.quantity : 1,
                        selected_product_color: cartItemData.selected_product_color,
                        selected_product_size: cartItemData.selected_product_size
                    });
                } else {
                    state.cartItems = state.cartItems.map(item => {
                        if (item.id === cartItem.id) {
                            return {
                                product: item.product,
                                quantity: cartItemData.quantity ? item.quantity + cartItemData.quantity : item.quantity + 1,
                                selected_product_color: cartItemData.selected_product_color,
                                selected_product_size: cartItemData.selected_product_size
                            }
                        }
                        return item;
                    })
                }

            } else {
                const cartItem = state.cartItems.find(
                    item =>
                        item.id === cartItemData.id &&
                        cartItemData.selected_product_color &&
                        cartItemData.selected_product_color === item.selected_product_color &&
                        cartItemData.selected_product_size &&
                        cartItemData.selected_product_size === item.selected_product_size &&
                        (cartItemData.id ? cartItemData.id === item.id : true)
                );
                if (!cartItem) {
                    state.cartItems.push({
                        product: product,
                        quantity: cartItemData.quantity ? cartItemData.quantity : 1,
                        selected_product_color: cartItemData.selected_product_color,
                        selected_product_size: cartItemData.selected_product_size
                    });
                } else if (cartItem !== undefined && (cartItem.selected_product_color !== cartItemData.selected_product_color || cartItem.selected_product_size !== cartItemData.selected_product_size)) {
                    state.cartItems = [
                        ...state.cartItems,
                        {
                            product: product,
                            quantity: cartItemData.quantity ? cartItemData.quantity : 1,
                            selected_product_color: cartItemData.selected_product_color,
                            selected_product_size: cartItemData.selected_product_size
                        }
                    ]
                } else {
                    state.cartItems = state.cartItems.map(item => {
                        if (item.id === cartItem.id) {
                            return {
                                product: item.product,
                                quantity: cartItemData.quantity ? item.quantity + cartItemData.quantity : item.quantity + 1,
                                selected_product_color: cartItemData.selected_product_color,
                                selected_product_size: cartItemData.selected_product_size
                            }
                        }
                        return item;
                    });
                }
            }

            cogoToast.success("Added To Cart", { position: "bottom-left" });
        },
        deleteFromCart(state, action) {
            state.cartItems = state.cartItems.filter(item => item.cartItemId !== action.payload);
        },
        decreaseQuantity(state, action) {
            const product = action.payload;
            if (product.quantity === 1) {
                state.cartItems = state.cartItems.filter(item => item.cartItemId !== product.cartItemId);
                cogoToast.error("Removed From Cart", { position: "bottom-left" });
            } else {
                state.cartItems = state.cartItems.map(item =>
                    item.cartItemId === product.cartItemId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
                cogoToast.warn("Item Decremented From Cart", { position: "bottom-left" });
            }
        },
        deleteAllFromCart(state) {
            state.cartItems = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(cartApiSlice.endpoints.addToCart.matchPending, (state, action) => {
                state.isLoading = true;
            })
            .addMatcher(cartApiSlice.endpoints.addToCart.matchFulfilled, (state, action) => {
                const product = action.payload.product;
                const cartItemData = action.payload
                if (!product.variation) {
                    const cartItem = state.cartItems.find(item => item.id === cartItemData.id);
                    if (!cartItem) {
                        state.cartItems.push({
                            product: product,
                            quantity: cartItemData.quantity ? cartItemData.quantity : 1,
                            selected_product_color: cartItemData.selected_product_color,
                            selected_product_size: cartItemData.selected_product_size
                        });
                    } else {
                        state.cartItems = state.cartItems.map(item => {
                            if (item.id === cartItem.id) {
                                return {
                                    product: item.product,
                                    quantity: cartItemData.quantity ? item.quantity + cartItemData.quantity : item.quantity + 1,
                                    selected_product_color: cartItemData.selected_product_color,
                                    selected_product_size: cartItemData.selected_product_size
                                }
                            }
                            return item;
                        })
                    }

                } else {
                    const cartItem = state.cartItems.find(
                        item =>
                            item.id === cartItemData.id &&
                            cartItemData.selected_product_color &&
                            cartItemData.selected_product_color === item.selected_product_color &&
                            cartItemData.selected_product_size &&
                            cartItemData.selected_product_size === item.selected_product_size &&
                            (cartItemData.id ? cartItemData.id === item.id : true)
                    );
                    if (!cartItem) {
                        state.cartItems.push({
                            product: product,
                            quantity: cartItemData.quantity ? cartItemData.quantity : 1,
                            selected_product_color: cartItemData.selected_product_color,
                            selected_product_size: cartItemData.selected_product_size
                        });
                    } else if (cartItem !== undefined && (cartItem.selected_product_color !== cartItemData.selected_product_color || cartItem.selected_product_size !== cartItemData.selected_product_size)) {
                        state.cartItems = [
                            ...state.cartItems,
                            {
                                product: product,
                                quantity: cartItemData.quantity ? cartItemData.quantity : 1,
                                selected_product_color: cartItemData.selected_product_color,
                                selected_product_size: cartItemData.selected_product_size
                            }
                        ]
                    } else {
                        state.cartItems = state.cartItems.map(item => {
                            if (item.id === cartItem.id) {
                                return {
                                    product: item.product,
                                    quantity: cartItemData.quantity ? item.quantity + cartItemData.quantity : item.quantity + 1,
                                    selected_product_color: cartItemData.selected_product_color,
                                    selected_product_size: cartItemData.selected_product_size
                                }
                            }
                            return item;
                        });
                    }
                }

                // cogoToast.success("", { position: "bottom-left" });
            })
            .addMatcher(cartApiSlice.endpoints.addToCart.matchRejected, (state, action) => {
                state.isLoading = false;
                errorToast(action.payload?.data?.error || "Something went wrong")

            })
    },
});

export const { addToCart, deleteFromCart, decreaseQuantity, deleteAllFromCart } = cartSlice.actions;
export default cartSlice.reducer;
