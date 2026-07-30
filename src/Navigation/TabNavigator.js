import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home';
import Cart from '../Screens/Cart';
import Profile from '../Screens/Profile';
import { Text } from 'react-native';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

    const cartData = useSelector(state => state.cart)
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,

                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: 'gray',

                tabBarStyle: {
                    height: 60,
                    paddingBottom: 5,
                },

                tabBarIcon: ({ focused }) => {

                    let icon = '';

                    if (route.name === 'Home') {
                        icon = '🏠';
                    }

                    else if (route.name === 'Cart') {
                        icon = '🛒';
                    }

                    else if (route.name === 'Profile') {
                        icon = '👤';
                    }

                    return (
                        <Text style={{ fontSize: 24 }}>
                            {icon}
                        </Text>
                    )
                }
            })}
        >

            <Tab.Screen
                name="Home"
                component={Home}
            />

            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    tabBarBadge: cartData.length > 0 ? cartData.length : null,

                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
            />
        </Tab.Navigator>
    )

}

export default TabNavigator;