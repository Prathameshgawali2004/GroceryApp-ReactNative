import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST, } from "../ActionType";


const initialState = [];

const WishlistReducers = (state = initialState, action) => {
        switch (action.type) {
                case ADD_TO_WISHLIST:
                        return [...state, action.payload];

                case REMOVE_FROM_WISHLIST:
                        return state.filter((item, index) => index !== action.payload);

                default:
                        return state;

        }


}
export default WishlistReducers;