import { Text, View, Image ,ScrollView} from 'react-native';
import { useState } from 'react';
import CustomInput from '../Custom/CustomInput';
import CustomButton from '../Custom/CustomButton';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {

const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');

  const navigation=useNavigation();

        return (

                <ScrollView style={{flex:1}}  
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}>
                
                <View style={{flex:1}}>

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
                                <Text style={{
                                                marginTop:15,
                                                 marginBottom: 25,
                                                alignSelf:'center',
                                                fontSize:22,
                                                fontWeight:'600',
                                                color:'#000',


                                }}> Create New Account </Text>

                                 <CustomInput
                                placeholder="Enter Name"
                                iconName="person"
                                value={name}
                                onChangeText={setName}
                        />


                        <CustomInput
                                placeholder="Enter Email Id"
                                iconName="email"
                                value={email}
                                onChangeText={setEmail}
                        />


                         <CustomInput
                                placeholder="Enter Phone Number"
                                iconName="phone"
                                value={phone}
                                onChangeText={setPhone}
                        />

                        <CustomInput
                                placeholder="Enter Password"
                                iconName="lock"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                        />

                        <CustomButton
                                title="Sign Up"
                                bgColor="#000"
                                textColor="white"
                                onPress={() => {
                                        console.log('Email:',email);
                                        console.log('Password:',password);
                                }}
                        />

                        <Text style={{

                                fontSize: 18,
                                fontWeight: '800',
                                alignSelf: 'center',
                                marginTop: 20,
                                textDecorationLine: 'underline'

                        }}

                                onPress={() => {
                                        navigation.goBack();
                                }}> Already have Account?
                        </Text>
                </View>
</ScrollView>
        );

};



export default SignUp;
