import { ADD_TO_CART, REMOVE_FROM_CART, Add_ADDRESSS, DELETE_ADDRESS, ADD_ORDER, DELETE_ORDER, ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, DECREASE_QUANTITY, INCREASE_QUANTITY } from "../ActionType";

export const addItemToCart = data => ({
    type: ADD_TO_CART,
    payload: data,

});

export const removeFromCart = index => ({
    type: REMOVE_FROM_CART,
    payload: index,
});

export const addAddress = data => ({
    type: Add_ADDRESSS,
    payload: data,
});


export const deleteAddress = index => ({
    type: DELETE_ADDRESS,
    payload: index,
});


export const addOrder = data => ({
    type: ADD_ORDER,
    payload: data,
});

export const deleteOrder = index => ({

    type: DELETE_ORDER,
    payload: index,
})



export const addToWishlist = data => ({
    type: ADD_TO_WISHLIST,
    payload: data,
});

export const removeFromWishlist = index => ({

    type: REMOVE_FROM_WISHLIST,
    payload: index,
})



export const increaseQuantity = index => ({
    type: INCREASE_QUANTITY,
    payload: index,
});

export const decreaseQuantity = index => ({

    type: DECREASE_QUANTITY,
    payload: index,
})





