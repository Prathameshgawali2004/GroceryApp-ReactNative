import React, { useContext } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity
} from '../Redux/Action/Action';
import CustomButton from '../Custom/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { isDark } = useContext(ThemeContext);

  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

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
            {cart.length}
          </Text>
        </View>
      </View>

      {/* EMPTY CART */}
      {cart.length === 0 ? (
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
          data={cart}
       keyExtractor={(item, index) => item.id + "_" + index}
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
                  ₹{item.price}
                </Text>

                {/* Quantity */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                  <TouchableOpacity
                    onPress={() => dispatch(decreaseQuantity(index))}
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
                    onPress={() => dispatch(increaseQuantity(index))}
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
                  onPress={() => dispatch(removeFromCart(index))}
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