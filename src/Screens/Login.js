import { View, Image, Text } from 'react-native';
import { useState } from 'react';
import CustomInput from '../Custom/CustomInput';
import CustomButton from '../Custom/CustomButton';
import { useNavigation } from '@react-navigation/native';
const Login = () => {
 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const navigation=useNavigation();

  return (
    <View style={{ flex: 1 }}>
      
      <Image
        source={require('../Images/logo.png')}
        style={{
                       
    width: '100%',
    height: 270,
    resizeMode: 'cover',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

        }}
      />

        <View style={{ marginTop: 40 }}>
      <CustomInput
        placeholder="Enter Email"
        iconName="email"
        value={email}
        onChangeText={setEmail}
         style={{ marginTop: 30 }}
      />

      <CustomInput
        placeholder="Enter Password"
        iconName="lock"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <CustomButton
        title="Login"
        bgColor="black"
        textColor="white"
        onPress={() => {
          console.log('Email:', email);
          console.log('Password:', password);
        }}
      />

      <Text style={{
        fontSize: 18,
        fontWeight: '800',
        alignSelf: 'center',
        marginTop: 20,
        textDecorationLine:'underline',
        
        
      }}
        onPress={()=>{
          navigation.navigate('SignUp')
        }}
      >
        Create New Account?
      </Text>
      </View>
    </View>
  );
};

export default Login;