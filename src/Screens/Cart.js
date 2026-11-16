import React, { useContext,useEffect,useState} from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import CustomButton from '../Custom/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api.js';
import { useDispatch} from 'react-redux';
import {setCart,updateQuantity,removeFromCart} from '../Redux/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();

  const [apiCart,setApiCart] = useState([]);
  const navigation = useNavigation();
  const { isDark } = useContext(ThemeContext);

  const totalPrice = apiCart.reduce((total, item) => {
  return total + (item.price || 0) * item.quantity;
}, 0);

const totalItems = apiCart.reduce((sum, item) => {
  return sum + item.quantity;
}, 0);

   // GET CART DATA
useEffect(() => {
  getCartData();  

  const unsubscribe = navigation.addListener('focus', () => {
    getCartData();
  });

  return unsubscribe;
}, [navigation]);

  const getCartData = async () => {
  try{
    const token = await AsyncStorage.getItem("TOKEN");

    const response = await fetch(
       `${BASE_URL}/cart`,
      {
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "Authorization":token
        }
      }
    )
    const data = await response.json();

    // console.log("CART RESPONSE:", data);

    if(Array.isArray(data)) {
      setApiCart(data);
      dispatch(setCart(data));
    }else{
      setApiCart([])
      dispatch(setCart([]));
      // console.log("CART API ERROR:", data);
      setApiCart([]);
    }

  }catch (error){
// console.log("CART ERROR:",error);
}
}


      // increase

const increaseQty =  async (item) => {

  const newQuantity = item.quantity +1;
  dispatch(
      updateQuantity({
          id:item.id,
          quantity:newQuantity
      })
  )

  //  UI update
  setApiCart(prev =>
    prev.map(i =>
      i.id === item.id ? { ...i, quantity: newQuantity} : i
    )
  );

    try{
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await fetch(
      `${BASE_URL}/cart/${item.id}`,
      {
        method :"PUT",
        headers:{
          "Content-Type": "application/json",
          "Authorization":token
        },

        body:JSON.stringify({
          quantity:newQuantity 
        })
    });

      const data = await response.json();

      // console.log("INCREASE RESPONSE:", data);

  } catch(error){
    // console.log( "INCREASE ERROR:",error);  
  }
}

      // Decrease
     
  const decreaseQty =  async (item) => {
    if(item.quantity <= 1){
      return;
    }
    const newQuantity = item.quantity -1;
    dispatch(
        updateQuantity({
          id:item.id,
          quantity: newQuantity
        })
    );


  setApiCart(prev =>
    prev.map(i =>
      i.id === item.id ? { ...i, quantity: newQuantity} : i
    )
  );

    try{
      const token = await AsyncStorage.getItem("TOKEN");
      const response = await fetch(
      `${BASE_URL}/cart/${item.id}`, 
        {
        method :"PUT",
        headers:{
          "Content-Type": "application/json",
          "Authorization":token
        },

        body:JSON.stringify({
          quantity:newQuantity 
        })
    });
    const data = await response.json();
    // console.log("DECREASE RESPONSE:",data)

  } catch(error){
    // console.log("DECREASE ERROR:",error);  
  }
}


    // delete

const removeItem = async (item) =>{
  setApiCart(prev =>
    prev.filter(i => i.id !==item.id)
);
 dispatch(removeFromCart(item.id));

try{
const token = await AsyncStorage.getItem ("TOKEN");
const response = await fetch(
  `${BASE_URL}/cart/${item.id}`,
   {
  method:'DELETE',
  headers:{
      "Authorization":token
  }
});

const data = await response.json();

// console.log(" DELETE RESPONSE:", data);


 // DB se latest data 
 getCartData();

} catch (error){
  // console.log("DELETE ERROR:",error);
}

};



  return (
    <View style={{
      flex: 1,
      padding: 20,
      backgroundColor: isDark ? '#121212' : '#fff'
    }}>

      {/* HEADER */}
      <View style={{
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 24 }}>🛒</Text>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 10,
            color: isDark ? '#fff' : '#000'
          }}>
            My Cart
          </Text>
        </View>

        <View style={{
          backgroundColor: '#000',
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 20,
        }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {totalItems}
          </Text>
        </View>
      </View>

      {/* EMPTY CART */}
      {apiCart.length === 0 ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 18,
            color: isDark ? '#aaa' : 'gray'
          }}>
            No items added in cart
          </Text>
        </View>
      ) : (

        <FlatList
          data={apiCart}
      //  keyExtractor={(item, index) => item.id + "_" + index}
      keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{
              flexDirection: 'row',
              backgroundColor: isDark ? '#1E1E1E' : '#fff',
              borderRadius: 16,
              padding: 12,
              marginBottom: 15,
              elevation: 4,
              alignItems: 'center'
            }}>

              <Image
                source={{ uri: item.image }}
                style={{ width: 85, height: 85, borderRadius: 12 }}
              />

              <View style={{
                flex: 1, marginLeft: 12, justifyContent: 'space-between'
              }}>
                <Text style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: isDark ? '#fff' : '#000'
                }}>
                   {item.name}
                </Text>

                <Text style={{
                  color: 'green',
                  fontSize: 18,
                  fontWeight: 'bold'
                }}>
                  {item.quantity}
                </Text>

                {/* Quantity */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                  <TouchableOpacity
                    onPress={() => decreaseQty(item)}
                    style={{
                      backgroundColor: isDark ? '#333' : "#eee",
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: isDark ? '#fff' : '#000' }}>-</Text>
                  </TouchableOpacity>

                  <Text style={{
                    marginHorizontal: 15,
                    color: isDark ? '#fff' : '#000'
                  }}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => increaseQty(item)}
                    style={{
                      backgroundColor: '#2874F0',
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{ color: '#fff' }}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(item)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: '#eee',
                    padding: 6,
                    borderRadius: 20,
                  }}
                >
                  <Text style={{ fontSize: 14 }}>🗑️</Text>
                </TouchableOpacity>

              </View>
            </View>
          )}

          ListFooterComponent={
            <View style={{
              marginTop: 10,
              padding: 15,
              borderRadius: 12,
              backgroundColor: isDark ? '#1E1E1E' : '#fff',
              elevation: 3
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: isDark ? '#fff' : '#000'
              }}>
                Total: ₹{totalPrice + 10}
              </Text>

              <CustomButton
                title="Checkout"
                bgColor="green"
                textColor="#fff"
                onPress={() => navigation.navigate('Checkout')}
              />
            </View>
          }
        />
      )}

    </View>
  );
};

export default Cart;