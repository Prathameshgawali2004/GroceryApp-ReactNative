import { createStore, combineReducers } from "redux";
import CartReducer from "../Reducers/Reducers";
import AddressReducers from "../Reducers/AddressReducers";
import OrderReducers from "../Reducers/OrderReducers";
import WishlistReducer from "../Reducers/WishlistReducers";


const rootReducer = combineReducers({
    cart: CartReducer,
    addressList: AddressReducers,
    orders: OrderReducers,
    wishlist: WishlistReducer,
})
const store = createStore(rootReducer);

export default store;