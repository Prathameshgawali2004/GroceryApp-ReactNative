import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../ThemeContext';

const OFFERS = [
  {
    id: '1',
    title: 'Flat ₹50 OFF',
    code: 'SAVE50',
    desc: 'On minimum order ₹299',
  },
  {
    id: '2',
    title: '₹100 OFF First Order',
    code: 'FIRST100',
    desc: 'For new users only',
  },
  {
    id: '3',
    title: 'Free Delivery',
    code: 'FREESHIP',
    desc: 'No delivery charge',
  },
];

const Offers = () => {

  const { isDark } = useContext(ThemeContext);

  const renderOffer = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: isDark ? '#1E1E1E' : '#fff',
          marginHorizontal: 15,
          marginBottom: 12,
          borderRadius: 16,
          padding: 18,
          elevation: 4,
        }}>

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000',
          }}>
          {item.title}
        </Text>

        <Text
          style={{
            color: isDark ? '#aaa' : '#666',
            marginTop: 5,
          }}>
          {item.desc}
        </Text>

        {/* COUPON BOX */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 15,
            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
            padding: 12,
            borderRadius: 10,
          }}>

          <Text
            style={{
              color: 'green',
              fontWeight: 'bold',
              fontSize: 16,
            }}>
            {item.code}
          </Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert('Copied', `${item.code} copied`)
            }
            style={{
              backgroundColor: '#2E7D32',
              paddingHorizontal: 15,
              paddingVertical: 6,
              borderRadius: 8,
            }}>

            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
              }}>
              Copy
            </Text>

          </TouchableOpacity>

        </View>

      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#F5F5F5',
      }}>

      <FlatList
        data={OFFERS}
        keyExtractor={(item) => item.id}
        renderItem={renderOffer}
        showsVerticalScrollIndicator={false}

        ListHeaderComponent={
          <>
            {/* HEADER */}
            <Text
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                margin: 15,
                color: isDark ? '#fff' : '#000',
              }}>
              Offers & Coupons
            </Text>

            {/* BANNER */}
            <View
              style={{
                backgroundColor: '#FF6B00',
                marginHorizontal: 15,
                borderRadius: 18,
                padding: 20,
                marginBottom: 15,
              }}>

              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                🔥 Big Sale!
              </Text>

              <Text
                style={{
                  color: '#fff',
                  marginTop: 5,
                }}>
                Get up to 50% OFF on all products
              </Text>

            </View>
          </>
        }

      />

    </SafeAreaView>
  );
};

export default Offers;