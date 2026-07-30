import { ADD_TO_CART,REMOVE_FROM_CART,INCREASE_QUANTITY,DECREASE_QUANTITY} from "../ActionType";


const initialState = [];


  const Reducers = (state = initialState,action) => {

    switch(action.type){

    case ADD_TO_CART:
        return[...state,{
            
            ...action.payload,
            quantity: action.payload.quantity ||1,
        }
        ];

            case  REMOVE_FROM_CART:
             return state.filter((item,index)=> index !==action.payload);

            case INCREASE_QUANTITY:
            return state.map((item,index) =>
                index === action.payload
            ? {...item,quantity: item.quantity + 1}
            :item
            );

                case DECREASE_QUANTITY:
                return state.map((item,index)=>            
                 index === action.payload
                ? { ...item, quantity: item.quantity - 1 }
                :item
                )

                .filter(item =>item.quantity >= 1);
                    default: 
                    return state;


    }
};

export default Reducers;