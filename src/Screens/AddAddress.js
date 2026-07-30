import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../Custom/CustomInput';
import CustomButton from '../Custom/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress } from '../Redux/Action/Action';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../ThemeContext';
import { postData } from '../services/api';

const AddAddress = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useContext(ThemeContext);

  const [city, setCity] = useState('');
  const [building, setBuilding] = useState('');
  const [Pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const addressList = useSelector(state => state.addressList);

  //  MAIN SAVE FUNCTION
  const handleSave = async () => {

    if (!city || !building || !Pincode) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (Pincode.length !== 6) {
      Alert.alert("Error", "Enter valid 6 digit pincode");
      return;
    }

    try {
      setLoading(true);

      //  API CALL
      const res = await postData({
        city,
        building,
        PinCode: Pincode,
      });

      const newId = res?.id ? res.id : Date.now();

      //  REDUX UPDATE
      dispatch(addAddress({
        id: newId,
        city,
        building,
        PinCode: Pincode,
        isDefault: addressList.length === 0
      }));

      setLoading(false);

      Alert.alert("Success", "Address Added Successfully");

      navigation.goBack();

    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F5F5F5'
    }}>

      {/* HEADER */}
      <View style={{
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: isDark ? '#333' : '#ddd'
      }}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: isDark ? '#444' : '#E5E5E5',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: isDark ? '#1E1E1E' : '#fff',
          }}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={isDark ? '#fff' : '#000'}
          />
        </TouchableOpacity>

      </View>

      {/* HEADING */}
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 25,
        marginHorizontal: 20,
        color: isDark ? '#fff' : '#000'
      }}>
        Add New Address
      </Text>

      {/* FORM CARD */}
      <View style={{
        marginHorizontal: 15,
        marginTop: 20,
        padding: 18,
        borderRadius: 18,
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        elevation: 5
      }}>

        <CustomInput
          placeholder="Enter City Name"
          iconName="location-city"
          value={city}
          onChangeText={setCity}
          isDark={isDark}
        />

        <View style={{ marginTop: 15 }} />

        <CustomInput
          placeholder="Enter Building Name"
          iconName="apartment"
          value={building}
          onChangeText={setBuilding}
          isDark={isDark}
        />

        <View style={{ marginTop: 15 }} />

        <CustomInput
          placeholder="Enter Pincode"
          iconName="pin-drop"
          value={Pincode}
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={setPincode}
          isDark={isDark}
        />

      </View>

      {/* BUTTON */}
      <View style={{
        marginHorizontal: 15,
        marginTop: 30
      }}>
        <CustomButton
          title={loading ? "Saving..." : "Save Address"}
          bgColor={isDark ? '#fff' : '#000'}
          textColor={isDark ? '#000' : '#fff'}
          onPress={handleSave}
        />
      </View>

    </View>
  );
};

export default AddAddress;