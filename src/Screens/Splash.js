import { View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Login')
        },1000 )
    }, []);
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems:'center',backgroundColor: '#F6F4EE'}}> 
        <Image source={require('../Images/splash1.png')} 
        style={{ width:250, height: 250,
    marginTop: 20,borderRadius:50, 
                resizeMode: 'contain' }} />
        </View>
            )
} 
export default Splash;




















