import { ADD_ORDER, DELETE_ORDER } from "../ActionType";


const initialState = [];


const OrderReducers = (state = initialState, action) => {

    switch (action.type) {

        case ADD_ORDER:
            return [...state, action.payload];

        case DELETE_ORDER:

            return state.filter((item, index) =>

                index !== action.payload
            );



        default:
            return state;


    }
};

export default OrderReducers;