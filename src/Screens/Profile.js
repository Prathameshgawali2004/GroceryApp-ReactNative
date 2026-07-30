import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';

const Profile = () => {

  const navigation = useNavigation();
  const { isDark } = useContext(ThemeContext);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>

      {/* HEADER */}
      <View style={{
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: isDark ? '#333' : '#ddd',
      }}>

        <Text style={{
          fontWeight: '600',
          fontSize: 22,
          color: isDark ? '#fff' : '#000'
        }}>
          Profile
        </Text>

        <TouchableOpacity>
          <Text style={{ fontSize: 24 }}>
            ⚙️
          </Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('../Images/Profile.png')}
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          alignSelf: 'center',
          marginTop: 30,
        }}
      />

      {/* NAME */}
      <Text style={{
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 15,
        color: isDark ? '#fff' : '#000'
      }}>
        Prathamesh
      </Text>

      {/* ADDRESS */}
      <TouchableOpacity
        style={{
          height: 55,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark ? '#333' : '#ddd',
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={() => navigation.navigate("MyAddress")}
      >
        <Text style={{
          fontSize: 16,
          color: isDark ? '#fff' : '#000'
        }}>
          My Address
        </Text>

        <Text style={{
          fontSize: 20,
          color: isDark ? '#fff' : '#000'
        }}>
          ›
        </Text>
      </TouchableOpacity>

      {/* ORDERS */}
      <TouchableOpacity
        style={{
          height: 55,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark ? '#333' : '#ddd',
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('MyOrders')}
      >
        <Text style={{
          fontSize: 16,
          color: isDark ? '#fff' : '#000'
        }}>
          My Orders
        </Text>

        <Text style={{
          fontSize: 20,
          color: isDark ? '#fff' : '#000'
        }}>
          ›
        </Text>
      </TouchableOpacity>

      {/* OFFERS */}
      <TouchableOpacity
        style={{
          height: 55,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark ? '#333' : '#ddd',
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate("Offers")}
      >
        <Text style={{
          fontSize: 16,
          color: isDark ? '#fff' : '#000'
        }}>
          Offers
        </Text>

        <Text style={{
          fontSize: 20,
          color: isDark ? '#fff' : '#000'
        }}>
          ›
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Profile;