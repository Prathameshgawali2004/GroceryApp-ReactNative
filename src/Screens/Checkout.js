import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import RazorpayCheckout from 'react-native-razorpay';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder } from '../Redux/Action/Action';
import { ThemeContext } from '../ThemeContext';

const Checkout = ({ route }) => {

  const { isDark } = useContext(ThemeContext);

  const cartData = useSelector(state => state.cart);
  const addressList = useSelector(state => state.addressList);

  const buyNow = route?.params?.buyNow || false;
  const singleProduct = route?.params?.product ?? null;

  const products =
    buyNow && singleProduct ? [singleProduct] : cartData;

  const [selectedAddress, setSelectedAddress] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const platformFee = 10;

  const getSubtotal = () => {
    let total = 0;
    products.forEach(item => {
      total += Number(item.price) * item.quantity;
    });
    return total;
  };

  const getTotal = () => {
    return getSubtotal() + platformFee;
  };



  const renderProduct = ({ item }) => {
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
              const addressString = `${item.city}-${item.building}-${item.PinCode}`;

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
                    {item.PinCode}
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
            alignItems: 'center'
          }}
          onPress={() => {

            if (selectedAddress === '') {
              Alert.alert('Select Address', 'Please select address');
              return;
            }

            const now = new Date();
            const orderDate = now.toLocaleDateString();
            const orderTime = now.toLocaleTimeString();


            const options = {
              description: 'Order Payment',
              currency: 'INR',
              key: 'rzp_test_T8DAX21eWNiKj1',
              amount: (getTotal() * 100).toString(),
              name: 'ShopEase',
            };

            RazorpayCheckout.open(options)
              .then(data => {

                dispatch(addOrder({
                  items: products,
                  total: getTotal(),
                  address: selectedAddress,
                  paymentId: data.razorpay_payment_id,
                  orderDate,
                  orderTime,
                }));

                setTimeout(() => {
                  navigation.replace('OrderSuccess');
                }, 200);

              })
              .catch(() => {

                dispatch(addOrder({
                  items: products,
                  total: getTotal(),
                  address: selectedAddress,
                  paymentId: 'FAILED_PAYMENT',
                  orderDate,
                  orderTime,
                }));


                setTimeout(() => {
                  navigation.replace('OrderSuccess');
                }, 200);

              });
          }}
        >
          <Text style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18
          }}>
            Place Order ₹{getTotal()}
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
};

export default Checkout;