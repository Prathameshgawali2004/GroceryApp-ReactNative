import { View, Text, Animated } from 'react-native';
import React, { useEffect, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';

const Splash = () => {
  const navigation = useNavigation();
  const { isDark } = useContext(ThemeContext);


  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#121212' : '#F6F4EE'
    }}>

      <Animated.Image
        source={require('../Images/splash1.png')}
        style={{
          width: 220,
          height: 220,
          transform: [{ scale }]
        }}
      />

      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 25,
        color: isDark ? '#fff' : '#000'
      }}>
        ShopEase
      </Text>

    </View>
  );
};

export default Splash;