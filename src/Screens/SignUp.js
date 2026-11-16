import React, { useState, useContext } from 'react';
import { Text, View, Image, ScrollView, Alert } from 'react-native';

import CustomInput from '../Custom/CustomInput';
import CustomButton from '../Custom/CustomButton';
import Loader from '../Custom/Loader';

import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';
import BASE_URL from '../config/api.js';

const SignUp = () => {

  const navigation = useNavigation();
  const { isDark } = useContext(ThemeContext);

  // States
  const [email, setEmail] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Validation
  const [badEmail, setBadEmail] = useState(false);
  const [badPassword, setBadPassword] = useState(false);
  const [badName, setBadName] = useState(false);
  const [badPhone, setBadPhone] = useState(false);

  // Loader
  const [modalVisible, setModalVisible] = useState(false);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const signup = async () => {

    let valid = true;

    // Name validation
    if (name.trim() === '') {
      setBadName(true);
      valid = false;
    } else {
      setBadName(false);
    }

    // Email validation
    if (
      email.trim() === '' ||
      !emailRegex.test(email.trim())
    ) {
      setBadEmail(true);
      valid = false;
    } else {
      setBadEmail(false);
    }

    // Phone validation
    if (
      phone.trim() === '' ||
      phone.length !== 10
    ) {
      setBadPhone(true);
      valid = false;
    } else {
      setBadPhone(false);
    }

    // Password validation
    if (password.trim() === '' || password.length < 6) {
      setBadPassword(true);
      valid = false;
    } else {
      setBadPassword(false);
    }

    
    if (!valid) return;

    setModalVisible(true);

    try {

      console.log("SIGNUP URL:", `${BASE_URL}/signup`);
      const response = await fetch(`${BASE_URL}/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    password: password,
  }),
});

console.log("HTTP STATUS:", response.status);


      const data = await response.json();
      console.log("SIGNUP RESPONSE:", data);

      setModalVisible(false);

      // Signup successful
      if (data.success) {

        Alert.alert(
          "Success",
          data.message || "Account Created Successfully ✅",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );

      } else {

        Alert.alert(
          "Signup Failed",
          data.message || "Unable to create account"
        );
      }

    } catch (error) {

      setModalVisible(false);

 console.log("SIGNUP NETWORK ERROR:", error);
  console.log("BASE URL USED:", BASE_URL);
  
      Alert.alert(
        "Connection Error",
        "Backend server se connection nahi ho pa raha. Please backend start karo."
      );
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff'
      }}
      contentContainerStyle={{
        paddingBottom: 30
      }}
      showsVerticalScrollIndicator={false}
    >

      <View style={{ flex: 1 }}>

        {/* IMAGE */}
        <Image
          source={require('../Images/logo2.png')}
          style={{
            width: '100%',
            height: 200,
            resizeMode: 'cover',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        />

        {/* TITLE */}
        <Text
          style={{
            marginTop: 20,
            marginBottom: 25,
            alignSelf: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000'
          }}
        >
          Create New Account
        </Text>

        {/* NAME */}
        <CustomInput
          placeholder="Enter Name"
          iconName="person"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setBadName(false);
          }}
          isDark={isDark}
        />

        {badName && (
          <Text
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: 'red'
            }}
          >
            Enter Name
          </Text>
        )}

        {/* EMAIL */}
        <CustomInput
          placeholder="Enter Email"
          iconName="email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setBadEmail(false);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          isDark={isDark}
        />

        {badEmail && (
          <Text
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: 'red'
            }}
          >
            Invalid Email
          </Text>
        )}

        {/* PHONE */}
        <CustomInput
          placeholder="Enter Phone"
          iconName="phone"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            setBadPhone(false);
          }}
          keyboardType="phone-pad"
          maxLength={10}
          isDark={isDark}
        />

        {badPhone && (
          <Text
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: 'red'
            }}
          >
            Invalid Phone
          </Text>
        )}

        {/* PASSWORD */}
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
          isDark={isDark}
        />

        {badPassword && (
          <Text
            style={{
              marginLeft: 15,
              marginTop: 5,
              color: 'red'
            }}
          >
            Password must be at least 6 characters
          </Text>
        )}

        {/* BUTTON */}
        <CustomButton
          title="Sign Up"
          bgColor={isDark ? '#ffd814' : '#000'}
          textColor={isDark ? '#000' : '#fff'}
          onPress={signup}
        />

        {/* LOGIN LINK */}
        <Text
          style={{
            fontSize: 16,
            alignSelf: 'center',
            marginTop: 20,
            textDecorationLine: 'underline',
            color: isDark ? '#fff' : '#000'
          }}
          onPress={() => navigation.goBack()}
        >
          Already have an account?
        </Text>

        {/* LOADER */}
        <Loader
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />

      </View>

    </ScrollView>
  );
};

export default SignUp;