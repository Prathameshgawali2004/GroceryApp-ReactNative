import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';

const OrderSuccess = () => {

  const navigation = useNavigation();
  const { isDark } = useContext(ThemeContext);

  const orders = useSelector(state => state.orders || []);
  const lastOrder = orders.length > 0 ? orders[orders.length - 1] : null;

  if (!lastOrder) return null;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#F5F5F5',
      }}>

      {/* Success Section */}

      <View
        style={{
          alignItems: 'center',
          paddingTop: 15,
          paddingBottom: 10,
        }}>

        <Image
          source={require('../Images/success.png')}
          style={{
            width: 140,
            height: 140,
            resizeMode: 'contain',
            alignSelf: 'center',
            marginTop: 5,
            marginBottom: 10,
          }}
        />

        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: isDark ? '#fff' : '#000',
            marginTop: 5,
            textAlign: 'center',
          }}>
          Order Placed Successfully
        </Text>

        <Text
          style={{
            marginTop: 6,
            fontSize: 15,
            color: isDark ? '#A0A0A0' : '#666',
            textAlign: 'center',
          }}>
          Your order has been confirmed.
        </Text>

      </View>

      {/* Order Summary Card */}

      <View
        style={{
          backgroundColor: isDark ? '#1E1E1E' : '#fff',
          marginHorizontal: 18,
          marginTop: 15,
          borderRadius: 18,
          padding: 22,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 8,
        }}>

        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000',
            marginBottom: 22,
          }}>
          Order Summary
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
          <Text style={{ color: isDark ? '#AAA' : '#666' }}>
            Order ID
          </Text>

          <Text
            style={{
              color: isDark ? '#fff' : '#000',
              fontWeight: 'bold',
            }}>
            #ORD459872
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
          <Text style={{ color: isDark ? '#AAA' : '#666' }}>
            Total
          </Text>

          <Text
            style={{
              color: '#2E7D32',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
            ₹{lastOrder?.total}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
          <Text style={{ color: isDark ? '#AAA' : '#666' }}>
            Payment
          </Text>

          <Text
            style={{
              color: '#2E7D32',
              fontWeight: 'bold',
            }}>
            Paid
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
          <Text style={{ color: isDark ? '#AAA' : '#666' }}>
            Delivery
          </Text>

          <Text style={{ color: isDark ? '#fff' : '#000' }}>
            Tomorrow
          </Text>
        </View>

        <View
          style={{
            marginBottom: 20,
          }}>

          <Text
            style={{
              color: isDark ? '#AAA' : '#666',
            }}>
            Address
          </Text>

          <Text
            style={{
              color: isDark ? '#fff' : '#000',
              marginTop: 8,
            }}>
            📍 {lastOrder?.address}
          </Text>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderColor: isDark ? '#333' : '#E0E0E0',
            paddingTop: 20,
          }}>

          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              color: isDark ? '#fff' : '#000',
              marginBottom: 18,
            }}>
            Products
          </Text>

          <FlatList
            data={lastOrder?.items}
            scrollEnabled={false}
            keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: isDark ? '#333' : '#EEEEEE',
                }}
              />
            )}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 15,
                }}>

                <View style={{ flex: 1 }}>

                  <Text
                    style={{
                      color: isDark ? '#fff' : '#000',
                      fontSize: 17,
                      fontWeight: '600',
                    }}>
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      color: isDark ? '#AAA' : '#666',
                      marginTop: 4,
                    }}>
                    ₹{item.price}
                  </Text>

                </View>

                <View
                  style={{
                    backgroundColor: '#E8F5E9',
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                  }}>

                  <Text
                    style={{
                      color: '#2E7D32',
                      fontWeight: 'bold',
                      fontSize: 15,
                    }}>
                    x {item.quantity}
                  </Text>

                </View>

              </View>
            )}
          />

        </View>

      </View>
      {/* Continue Shopping Button */}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.replace('MainDrawer')}
        style={{
          backgroundColor: '#2874F0',
          marginHorizontal: 20,
          marginTop: 20,
          height: 58,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#2874F0',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        }}>

        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 0.5,
          }}>
          Continue Shopping
        </Text>

      </TouchableOpacity>

      {/* View Orders Button */}

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('MyOrders')}
        style={{
          backgroundColor: '#2E7D32',
          marginHorizontal: 20,
          marginTop: 15,
          marginBottom: 35,
          height: 58,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#2E7D32',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 8,
        }}>

        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: '700',
            letterSpacing: 0.5,
          }}>
          View Orders
        </Text>

      </TouchableOpacity>

    </ScrollView>
  );
};

export default OrderSuccess;
