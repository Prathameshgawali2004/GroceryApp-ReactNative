import{} from 'react-native';
import React from 'react'
import{createNativeStackNavigator} from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import Login from'./Screens/Login'
import Splash from'./Screens/Splash'
import SignUp from'./Screens/SignUp'

const Stack =createNativeStackNavigator()
const AppNavigator = () => {


  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
          name="Home"
          component={Splash}
          options={{headerShown: false}}
          />
          
          <Stack.Screen
          name="Login"
          component={Login}
        options={{headerShown: false}}
          />

      <Stack.Screen
      name="SignUp"
      component={SignUp}
      options={{headerShown: false}}
      />


          </Stack.Navigator>
      </NavigationContainer>
    
  )
}

export default AppNavigator;

