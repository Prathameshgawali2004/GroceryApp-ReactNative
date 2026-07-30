import { } from 'react-native';
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './Screens/Login'
import Splash from './Screens/Splash'
import SignUp from './Screens/SignUp'
import Product from './Screens/Product'
import DrawerNavigator from './Navigation/DrawerNavigator';
import MyAddress from './Screens/MyAddress'
import AddAddress from './Screens/AddAddress'
import Checkout from './Screens/Checkout'
import OrderSuccess from './Screens/OrderSuccess'
import MyOrders from './Screens/MyOrders'
import Wishlist from './Screens/Wishlist';
import Settings from './Screens/Settings';
import ProductDetails from './Screens/ProductDetails'
import Offers from './Screens/Offers'

const Stack = createNativeStackNavigator()
const AppNavigator = () => {


  return (

    <Stack.Navigator initialRouteName='Splash'>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Product"
        component={Product}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name="MainDrawer"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MyAddress"
        component={MyAddress}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Checkout"
        component={Checkout}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccess}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Offers"
        component={Offers}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>


  )
}

export default AppNavigator;

