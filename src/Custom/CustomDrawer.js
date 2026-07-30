import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemeContext } from '../ThemeContext';

const CustomDrawer = (props) => {

  const { isDark } = useContext(ThemeContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    getData();
  }, []);

const getData = async () => {
  const n = await AsyncStorage.getItem('NAME');
  const e = await AsyncStorage.getItem('EMAIL');

  setName(n || 'User');
  setEmail(e || 'example@gmail.com');
};

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff'
    }}>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flexGrow: 1 }}>

        {/* Header */}
        <View style={[
          style.header,
          { backgroundColor: isDark ? '#1E1E1E' : '#2874F0' }
        ]}>

          <View style={style.userRow}>

            <Image
              source={require('../Images/Profile.png')}
              style={style.profileImage}
            />

            <View style={style.userInfo}>
              <Text style={[
                style.name,
                { color: '#fff' }
              ]}>
                {name}
              </Text>

              <Text style={[
                style.email,
                { color: isDark ? '#ccc' : '#EAF2FF' }
              ]}>
                {email}
              </Text>
            </View>
          </View>
        </View>

        <View style={[
          style.divider,
          { backgroundColor: isDark ? '#333' : '#ddd' }
        ]} />

        {/* Drawer Items */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={[
        style.footer,
        {
          borderTopColor: isDark ? '#333' : '#ddd',
          backgroundColor: isDark ? '#121212' : '#fff'
        }
      ]}>

        <TouchableOpacity
          style={style.logoutButton}
          onPress={() => {
            Alert.alert(
              'Logout',
              'Are you sure?',
              [
                { text: 'Cancel' },
                {
                  text: 'Yes',
                  onPress: async () => {
                    await AsyncStorage.removeItem('IS_LOGIN');
                    props.navigation.replace('Login');
                  }
                }
              ]
            );
          }}>

          <Ionicons
            name="log-out-outline"
            size={24}
            color={isDark ? '#fff' : "#E53935"}
          />

          <Text style={[
            style.logoutText,
            { color: isDark ? '#fff' : '#E53935' }
          ]}>
            Logout
          </Text>

        </TouchableOpacity>

        <View style={[
          style.footerDivider,
          { backgroundColor: isDark ? '#333' : '#ddd' }
        ]} />

        <Text style={[
          style.version,
          { color: isDark ? '#aaa' : '#777' }
        ]}>
          Version 1.0.0
        </Text>

        <Text style={[
          style.madeWith,
          { color: isDark ? '#888' : '#999' }
        ]}>
          Made with ❤️ by Tushar
        </Text>

      </View>

    </View>
  );
};

const style = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingBottom: 18,
    paddingHorizontal: 15,
     borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#fff',
     borderWidth: 2,
  borderColor: '#fff',
  },

  userInfo: {
    marginLeft: 10,
    flex: 1,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
  },

  email: {
    marginTop: 2,
    fontSize: 12,
  },

  divider: {
    height: 1,
    marginVertical: 10,
  },

  footer: {
    borderTopWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutText: {
    fontSize: 17,
    marginLeft: 12,
    fontWeight: '600',
  },

  footerDivider: {
    height: 1,
    marginVertical: 15,
  },

  version: {
    textAlign: 'center',
    fontSize: 13,
  },

  madeWith: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
  },
});

export default CustomDrawer;