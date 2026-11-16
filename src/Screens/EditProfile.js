
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api';
import { useNavigation } from '@react-navigation/native';

const EditProfile = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET PROFILE
  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('TOKEN');

      const response = await fetch(`${BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setName(data.user.name);
        setPhone(data.user.phone || '');
      } else {
        Alert.alert('Error', data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.log('GET PROFILE ERROR:', error);
      Alert.alert('Error', 'Unable to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // UPDATE PROFILE
  const updateProfile = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Validation', 'Please enter name and phone number');
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      Alert.alert('Validation', 'Enter a valid 10 digit phone number');
      return;
    }

    try {
      setSaving(true);

      const token = await AsyncStorage.getItem('TOKEN');

      const response = await fetch(`${BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Success',
          'Profile updated successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', data.message || data.profile || 'Update failed');
      }
    } catch (error) {
      console.log('UPDATE PROFILE ERROR:', error);
      Alert.alert('Error', 'Unable to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    }}>

      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 25,
      }}>
        Edit Profile
      </Text>

      <Text style={{ color: '#333', marginBottom: 8 }}>
        Full Name
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          color: '#000',
          marginBottom: 20,
        }}
      />

      <Text style={{ color: '#333', marginBottom: 8 }}>
        Phone Number
      </Text>

      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        maxLength={10}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          color: '#000',
          marginBottom: 30,
        }}
      />

      <TouchableOpacity
        onPress={updateProfile}
        disabled={saving}
        style={{
          backgroundColor: '#16A34A',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          }}>
            Save Profile
          </Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

export default EditProfile;
