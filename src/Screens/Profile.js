import { View, Text, ActivityIndicator,TouchableOpacity,Image} from 'react-native';
import React,{useState,useEffect,useContext} from 'react';
import  AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';


const Profile = () => {

  const navigation = useNavigation();
  const { isDark } = useContext(ThemeContext);
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

    const getProfile  = async () => {
      try{
          const token =await AsyncStorage.getItem('TOKEN');

        if(!token){
          console.log('Token not found');
          return;
        }

        const response = await fetch(`${BASE_URL}/profile`,{
            method:'GET',
            headers:{
              Authorization:`Bearer ${token}`,
              'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if(data.success){
          setUser(data.user);
        } else{
          console.log('PROFILE ERROR:',data.message);
        }
        } catch (error){
          console.log('GET PROFILE ERROR:',error);
        } finally {
          setLoading(false);
        }
      };

      useEffect(()=>{
        getProfile();
    },[]);


  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}>

      {/* HEADER */}
      <View style={{
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: isDark ? '#333' : '#ddd',
      }}>

        <Text style={{
          fontWeight: '600',
          fontSize: 22,
          color: isDark ? '#fff' : '#000'
        }}>
          Profile
        </Text>

       <TouchableOpacity
  onPress={() => navigation.navigate('EditProfile')}
>
  <Text style={{ fontSize: 24 }}>⚙️</Text>
</TouchableOpacity>
      </View>

      <Image
        source={require('../Images/Profile.png')}
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          alignSelf: 'center',
          marginTop: 30,
        }}
      />


      {/* USER DETAILS */}
      {loading ? (
        <ActivityIndicator 
        size="large" 
       color={isDark ? '#fff':'#000'}
        style={{ marginTop: 20}}
      />

      ):(
        <View>
          <Text style={{
              fontSize: 22,
              fontweight:'700',
              textAlign:'center',
              marginTop:15,
              color: isDark ? '#fff' : '#000',
          }}> 
              {user?.name|| 'User'}
              </Text>

              <Text style={{
                fontSize:14,
            
                textAlign:'center',
                marginTop:5,
                color: isDark ? '#fff' : '#000',
              }}> {user?.email}
              </Text>

              <Text style={{
                fontSize:14,
                textAlign:'center',
                marginTop:5,
                color: isDark ? '#bbb' : '#666',
              }}>{user?.phone}
              </Text>
                </View> 
      )}

      {/* ADDRESS */}
      <TouchableOpacity
        style={{
          height: 55,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark ? '#333' : '#ddd',
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={() => navigation.navigate("MyAddress")}
      >
        <Text style={{
          fontSize: 16,
          color: isDark ? '#fff' : '#000'
        }}>
          My Address
        </Text>

        <Text style={{
          fontSize: 20,
          color: isDark ? '#fff' : '#000'
        }}>
          ›
        </Text>
      </TouchableOpacity>

      {/* ORDERS */}
      <TouchableOpacity
        style={{
          height: 55,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark ? '#333' : '#ddd',
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('MyOrders')}
      >
        <Text style={{
          fontSize: 16,
          color: isDark ? '#fff' : '#000'
        }}>
          My Orders
        </Text>

        <Text style={{
          fontSize: 20,
          color: isDark ? '#fff' : '#000'
        }}>
          ›
        </Text>
      </TouchableOpacity>

      {/* OFFERS */}
      <TouchableOpacity
        style={{
          height: 55,
          borderBottomWidth: 0.5,
          borderBottomColor: isDark ? '#333' : '#ddd',
          paddingHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate("Offers")}
      >
        <Text style={{
          fontSize: 16,
          color: isDark ? '#fff' : '#000'
        }}>
          Offers
        </Text>

        <Text style={{
          fontSize: 20,
          color: isDark ? '#fff' : '#000'
        }}>
          ›
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Profile;