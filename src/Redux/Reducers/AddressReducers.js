import { Add_ADDRESSS, DELETE_ADDRESS } from "../ActionType";


const initialState = [];


const AddressReducers = (state = initialState, action) => {

    switch (action.type) {

        case Add_ADDRESSS:
            return [...state, action.payload];

        case DELETE_ADDRESS:

            return state.filter((item, index) =>

                index !== action.payload
            );



        default:
            return state;


    }
};

export default AddressReducers;