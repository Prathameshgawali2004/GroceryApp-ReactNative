import React, { useState, useContext } from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  Alert
} from 'react-native';

import CustomInput from '../Custom/CustomInput';
import CustomButton from '../Custom/CustomButton';
import Loader from '../Custom/Loader';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../ThemeContext';

const Login = () => {
  const navigation = useNavigation();

  const { isDark } = useContext(ThemeContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const [badEmail, setBadEmail] = useState(false);
  const [badPassword, setBadPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const login = async () => {
    let valid = true;

    if (email.trim() === '' || !emailRegex.test(email)) {
      setBadEmail(true);
      valid = false;
    } else {
      setBadEmail(false);
    }

    if (password.trim() === '') {
      setBadPassword(true);
      valid = false;
    } else {
      setBadPassword(false);
    }

    if (!valid) return;

    setModalVisible(true);

    const storedEmail = await AsyncStorage.getItem('EMAIL');
    const storedPassword = await AsyncStorage.getItem('PASSWORD');

    setTimeout(() => {
      setModalVisible(false);

      if (email === storedEmail && password === storedPassword) {
        navigation.replace('MainDrawer');
      } else {
        Alert.alert('Login Failed', 'Invalid Email or Password');
      }
    }, 1500);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flex: 1 }}>

        {/* IMAGE */}
        <Image
          source={require('../Images/logo.png')}
          style={{
            width: '100%',
            height: 220,
            resizeMode: 'cover',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />

        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 15,
          color: isDark ? '#fff' : '#000'
        }}>
          Welcome Back 👋
        </Text>

        <Text style={{
          textAlign: 'center',
          color: isDark ? '#aaa' : '#666',
          fontSize: 16,
          marginTop: 10,
          marginBottom: 20,
        }}>
          Login to continue shopping
        </Text>

        {/* INPUTS */}
        <View style={{ marginTop: 25 }}>

          <CustomInput
            placeholder="Enter Email Id"
            iconName="email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setBadEmail(false);
            }}
          />

          {badEmail && (
            <Text style={{ marginTop: 10, marginLeft: 15, color: 'red' }}>
              Please Enter Valid Email
            </Text>
          )}

          <CustomInput
            placeholder="Enter Password"
            iconName="lock"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setBadPassword(false);
            }}
            secureTextEntry={hidePassword}
            isPassword={true}
            hidePassword={hidePassword}
            setHidePassword={setHidePassword}
          />

          {badPassword && (
            <Text style={{ marginTop: 10, marginLeft: 15, color: 'red' }}>
              Please Enter Password
            </Text>
          )}

          <CustomButton
            title="Login"
            bgColor={isDark ? '#ffd814' : '#000'}
            textColor={isDark ? '#000' : '#fff'}
            onPress={login}
          />


          <Text
            style={{
              textAlign: 'center',
              marginTop: 15,
              color: '#2874F0',
              fontWeight: '600',
            }}
            onPress={() => Alert.alert('Coming soon')}
          >
            Forgot Password?
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              alignSelf: 'center',
              marginTop: 20,
              textDecorationLine: 'underline',
              marginBottom: 50,
              color: isDark ? '#fff' : '#000'
            }}
            onPress={() => navigation.navigate('SignUp')}
          >
            Create New Account?
          </Text>

          <Loader
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />

        </View>
      </View>
    </ScrollView>
  );
};

export default Login;