import React, { useState, useContext } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import CustomInput from '../Custom/CustomInput';
import CustomButton from '../Custom/CustomButton';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../ThemeContext';
import { postData,updateData} from '../services/api';

const AddAddress = () => {

  const navigation = useNavigation();
  const route= useRoute();
  const { isDark } = useContext(ThemeContext);

  // Check edit address

  const address = route.params?.address;
  const isEdit = !!address?.id;

  // Load existing address data
  const[city,setCity] = useState(address?.city || '');
  const [building, setBuilding] = useState(address?.building ||'');
  const [Pincode, setPincode] = useState(
  String(address?.pincode || '') );
  const [loading, setLoading] = useState(false);
 

  //  MAIN SAVE FUNCTION
  const handleSave = async () => {

    if (!city.trim() || !building.trim() || !Pincode.trim()) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!/^\d{6}$/.test(Pincode)) {
      Alert.alert("Error", "Enter valid 6 digit pincode");
      return;
    }

    try {
      setLoading(true);

      //  API CALL
      const body ={
        city:city.trim(),
        building:building.trim(),
        pincode: Pincode,
      };

      let res;

      // Edit or Add

      if(isEdit){
        res = await updateData(address.id,body);
      } else{
        res = await postData(body);
      }

      Alert.alert("Success",
        res.message ||(isEdit ? "Address Updated" : "Address added")
        );
      
      navigation.goBack();

    } catch (err) {
      console.log('UPDATE ADDRESS ERROR:',err.message);

      Alert.alert("Error", err.message || "Failed to update address");
    } finally {
      setLoading(false);  
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
        {isEdit ? "Edit Address":"Add New Address"}
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
          title={
            loading 
            ?(isEdit ? "Updating..." : "Saving...")
           : (isEdit ? "Update Address" : "Save Address")
          }

          bgColor={isDark ? '#fff' : '#000'}
          textColor={isDark ? '#000' : '#fff'}
          onPress={handleSave}
        />
      </View>

    </View>
  );
};

export default AddAddress;