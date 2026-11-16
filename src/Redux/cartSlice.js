import { createSlice } from '@reduxjs/toolkit';


const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const existingitem = state.find(
      item => item.id === action.payload.id
      );

        if(existingitem){
        existingitem.qunatity =
        ( existingitem.qunatity || 1)+1;
        }else{
          state.push({
            ...action.payload,
            quantity:1,
          })
        }
      },

        removeFromCart: (state,action) =>{
          return state.filter(
            item =>item.id !== action.payload
          );
        },

        updateQuantity:(state,action) =>{
          const {id,quantity} = action.payload;
        const item = state.find(item =>item.id ===id);
          if(item){
              item.quantity = quantity;
          }
        },
          clearCart: ()=>{
            return[];            
    },
    
    setCart:(state,action) =>{
      return action.payload;
    },
  },
});

export const { addToCart,removeFromCart,updateQuantity,clearCart,setCart} = cartSlice.actions;
export default cartSlice.reducer;