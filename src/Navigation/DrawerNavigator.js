import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from '../Navigation/TabNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MyAddress from '../Screens/MyAddress'
import MyOrders from '../Screens/MyOrders'
import Profile from '../Screens/Profile'
import Wishlist from '../Screens/Wishlist'
import Settings from '../Screens/Settings'

import CustomDrawer from '../Custom/CustomDrawer'

import { ThemeContext } from '../ThemeContext';
import { lightTheme, darkTheme } from '../ThemeColors';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {

  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? darkTheme : lightTheme;

  return (

    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{

        headerShown: false,
        drawerType: 'front',
        swipeEnabled: true,
      
        drawerStyle: {
          width: 250,
          backgroundColor: theme.background,
        },

        drawerActiveBackgroundColor: isDark ? '#333' : '#E8F1FF',
        drawerActiveTintColor: isDark ? '#4FC3F7' : '#2874F0',
        drawerInactiveTintColor: isDark ? '#ccc' : '#444',

        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
        },

        drawerItemStyle: {
          height: 52,
          borderRadius: 12,
          marginHorizontal: 10,
          marginVertical: 5,
        }

      }}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="My Orders"
        component={MyOrders}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bag-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="My Address"
        component={MyAddress}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="location-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />

    </Drawer.Navigator>

  );
};

export default DrawerNavigator;