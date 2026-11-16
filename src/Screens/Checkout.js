import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Alert,

} from 'react-native';
import React, { useState, useContext, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation,useFocusEffect} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../Redux/Action/Action';
import { ThemeContext } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api.js';


const Checkout = ({ route }) => {
  const { isDark } = useContext(ThemeContext);

  const cartData = useSelector(state => state.cart);
  const[addressList,setaddressList] = useState([]);
  const [addressLoading,setAddressLoading] = useState(false); 

  const buyNow = route?.params?.buyNow || false;
  const singleProduct = route?.params?.product ?? null;

  const products =
    buyNow && singleProduct ? [singleProduct] : cartData;

  const [selectedAddress, setSelectedAddress] = useState('');

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchAddresses = async() =>{
        try{
          setAddressLoading(true);

          const token = await AsyncStorage.getItem('TOKEN');

          

          const response = await fetch(`${BASE_URL}/address`,{
            method:'GET',
          headers:{
            'Content-Type':'application/json',
            Authorization: `Bearer ${token}`,
          },         
          });

          const result = await response.json();

          if(!response.ok || !result.success){
          throw new Error(result.message || 'Failed to fetch addresses');
          }

            setaddressList(result.address || []);

          } catch (error) {
            console.log('FETCH ADDRESS ERROR:',error);
            Alert.alert('Error',error.message); 

          } finally{
            setAddressLoading(false);
           }
          };

          fetchAddresses();
          },[])
          );
        


  
  const navigation = useNavigation();

  const platformFee = 10;

  const getSubtotal = () => {
    let total = 0;

    products.forEach(item => {
      total += Number(item.price) * Number(item.quantity ||1);
    });
    return total;
  };

  const getTotal = () => {
    return getSubtotal() + platformFee;
  };


  const renderProduct = ({ item,index}) => {
    return (
      <View style={{
        flexDirection: 'row',
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        marginHorizontal: 15,
        marginTop: 12,
        padding: 15,
        borderRadius: 18,
        elevation: 4,
      }}>

        <Image
          source={{ uri: item.image }}
          style={{
            width: 85,
            height: 85,
            borderRadius: 12,
          }}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#000'
            }}>
              {item.name}
            </Text>

            <Text style={{
              color: '#2E7D32',
              fontSize: 18,
              fontWeight: 'bold'
            }}>
              ₹{item.price}
            </Text>
          </View>

          <Text style={{
            color: '#888',
            textDecorationLine: 'line-through'
          }}>
            ₹{item.oldPrice}
          </Text>

          <Text style={{
            color: '#666',
            fontSize: 13,
            marginTop: 5
          }}>
            🚚 Delivery by {item.delivery}
          </Text>

          <Text style={{
            marginTop: 6,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000'
          }}>
            Qty : {item.quantity}
          </Text>

        </View>
      </View>
    );
  };

  const handlePlaceOrder = async() =>{
    if(!selectedAddress){
      Alert.alert('Select address','Please select delivery address.');
      return;
    }

    if(!products || products.length ===0){
      Alert.alert('Empty Cart','please add products before checkout.');
      return;
    }

    try{
        const token = await AsyncStorage.getItem('TOKEN');
        if(!token){
          Alert.alert('Login Required','Please login again.');
          return;
        }

          const options = {
        description: 'Order Payment',
        currency: 'INR',
        key: 'rzp_test_T8DAX21eWNiKj1',
        amount: Math.round(getTotal() * 100),
        name: 'ShopEase',
      };

          // Open Razorpay payment

  
      console.log('CHECKOUT START');
    console.log('AMOUNT:', getTotal() * 100);
    console.log('TOKEN:', token);
          const paymentData = await RazorpayCheckout.open(options);

             // Save order after payment success

             console.log('PAYMENT SUCCESS:', paymentData);
            

              const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address: selectedAddress,
          payment_id: paymentData.razorpay_payment_id,

          buy_now: buyNow,
          product_id: buyNow ? products[0].id: null,
          quantity:  buyNow ? Number(products[0].quantity || 1): null,
        }),
      });

       const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Payment succeeded, but order could not be saved.'
        );
      }

      const now = new Date();

       // Save order to Redux only after backend success
       dispatch(
        addOrder({
          items: products,
          total: getTotal(),
          address: selectedAddress,
          paymentId: paymentData.razorpay_payment_id,
          orderDate: now.toLocaleDateString(),
          orderTime: now.toLocaleTimeString(),
        })
      );

      navigation.replace('OrderSuccess');
    } catch (error) {
      // console.log('Checkout error:', error);

      Alert.alert(
        'Checkout Error',
        error?.description ||
          error?.message ||
          'Checkout could not be completed. Please verify payment status before retrying.'
      );
    }
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F5F5F5'
    }}>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item, index) => item.id + "_" + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}

        ListHeaderComponent={
          <>
            <Text style={{
              fontSize: 26,
              fontWeight: 'bold',
              marginTop: 15,
              marginHorizontal: 18,
              color: isDark ? '#fff' : '#000',
            }}>
              Checkout
            </Text>

            {/* PRICE DETAILS */}
            <View style={{
              backgroundColor: isDark ? '#1E1E1E' : '#fff',
              margin: 15,
              borderRadius: 18,
              padding: 18,
              elevation: 5,
            }}>

              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 15,
                color: isDark ? '#fff' : '#000'
              }}>
                Price Details
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Subtotal</Text>
                <Text>₹{getSubtotal()}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Text>Platform Fee</Text>
                <Text>₹10</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <Text>Delivery</Text>
                <Text style={{ color: 'green' }}>FREE</Text>
              </View>

              <View style={{
                height: 1,
                backgroundColor: '#ddd',
                marginVertical: 12
              }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total</Text>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: 'green'
                }}>
                  ₹{getTotal()}
                </Text>
              </View>

            </View>

            {/* ADDRESS TITLE */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginHorizontal: 15,
              marginTop: 10,
              marginBottom: 10,
              color: isDark ? '#fff' : '#000',
            }}>
              Delivery Address
            </Text>
          </>
        }

        ListFooterComponent={
          <>
            {addressList.map((item, index) => {
              const addressString = `${item.city}-${item.building}-${item.pincode}`;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedAddress(addressString)}
                  style={{
                    backgroundColor:
                      selectedAddress === addressString
                        ? '#E8F5E9'
                        : isDark ? '#1E1E1E' : '#fff',

                    marginHorizontal: 15,
                    marginTop: 8,
                    marginBottom: 18,
                    borderRadius: 18,
                    padding: 18,

                    borderWidth: selectedAddress === addressString ? 2 : 1,
                    borderColor: selectedAddress === addressString ? '#2E7D32' : '#ddd',
                  }}
                >

                  <Text style={{ color: '#777', fontSize: 12 }}>
                    Address {index + 1}
                  </Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}>
                    📍 {item.city}
                  </Text>

                  <Text style={{ marginTop: 5 }}>
                    {item.building}
                  </Text>

                  <Text>
                    {item.pincode}
                  </Text>

                  {selectedAddress === addressString && (
                    <Text style={{
                      marginTop: 8,
                      color: '#2E7D32',
                      fontWeight: 'bold'
                    }}>
                      ✅ Selected
                    </Text>
                  )}

                </TouchableOpacity>
              );
            })}
          </>
        }
      />

      {/*  BUTTON FIX */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: isDark ? '#121212' : '#fff',
        padding: 15,
        elevation: 20,
      }}>
<TouchableOpacity
          style={{
            backgroundColor: '#FF6A00',
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
          }}
          onPress={handlePlaceOrder}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            Place Order ₹{getTotal()}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Checkout;



