import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST,SET_WISHLIST } from "../ActionType";


const initialWishlistState = [];

const WishlistReducers = (state = initialWishlistState, action) => {
        switch (action.type) {

                case SET_WISHLIST:
                return action.payload;

                case ADD_TO_WISHLIST:
                        return[...state,action.payload];
                               
                   

                case REMOVE_FROM_WISHLIST:
                        return state.filter(
                                item => item.id !== action.payload);

                default:
                        return state;

        }


}
export default WishlistReducers;