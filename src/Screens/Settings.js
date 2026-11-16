import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({ navigation }) => {

  const { isDark, toggleTheme } = useContext(ThemeContext);

  const [notifications, setNotifications] = useState(true);
  const handleLogout = async () => {
    try{
        await AsyncStorage.removeItem('TOKEN');
        navigation.reset({
        index: 0,
        routes:[{ name:'Login'}],         
        });
    } catch (error){
      console.log('LOGOUT ERROR:',error);
      Alert.alert('Error','Unable to logout');
    }
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff'
      }}>

      {/* HEADER */}
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          margin: 20,
          color: isDark ? '#fff' : '#000'
        }}>
        ⚙️ Settings
      </Text>

      {/* DARK MODE */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderBottomWidth: 0.5,
        borderColor: isDark ? '#333' : '#ddd'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="moon-outline" size={22} color={isDark ? '#fff' : '#000'} />
          <Text style={{
            marginLeft: 12,
            fontSize: 16,
            color: isDark ? '#fff' : '#000'
          }}>
            Dark Mode
          </Text>
        </View>

        <Switch
          value={isDark}
          onValueChange={toggleTheme}
        />
      </View>

      {/* NOTIFICATIONS */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderBottomWidth: 0.5,
        borderColor: isDark ? '#333' : '#ddd'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="notifications-outline" size={22} color={isDark ? '#fff' : '#000'} />
          <Text style={{
            marginLeft: 12,
            fontSize: 16,
            color: isDark ? '#fff' : '#000'
          }}>
            Notifications
          </Text>
        </View>

        <Switch
          value={notifications}
          onValueChange={() => setNotifications(!notifications)}
        />
      </View>

      {/* HELP */}
      <TouchableOpacity
        onPress={() => Alert.alert('Help', 'Contact support at support@app.com')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 18,
          borderBottomWidth: 0.5,
          borderColor: isDark ? '#333' : '#ddd'
        }}>
        <Ionicons name="help-circle-outline" size={22} color={isDark ? '#fff' : '#000'} />
        <Text style={{
          marginLeft: 12,
          fontSize: 16,
          color: isDark ? '#fff' : '#000'
        }}>
          Help & Support
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}
        {/* LOGOUT */}
<TouchableOpacity
  onPress={() => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: handleLogout,
      },
    ]);
  }}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginTop: 20,
  }}
>
  <Ionicons name="log-out-outline" size={22} color="red" />

  <Text style={{
    marginLeft: 12,
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  }}>
    Logout
  </Text>
</TouchableOpacity>

    </SafeAreaView>
  );
};

export default Settings;