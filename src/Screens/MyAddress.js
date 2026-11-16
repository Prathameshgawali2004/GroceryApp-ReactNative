
import React, { useContext, useCallback, useState } from 'react';

import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ThemeContext } from '../ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getData, deleteData } from '../services/api';

const MYAddress = () => {

  const navigation = useNavigation();

  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isDark } = useContext(ThemeContext);

  // GET ADDRESS API
  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const response = await getData();

      if (response.success) {
        setAddressList(
          response.address || response.addresses || []
        );
      }

    } catch (err) {
      console.log('GET ADDRESS ERROR:', err);
      Alert.alert('Error', 'Unable to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  // SCREEN FOCUS
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  // DELETE ADDRESS API
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Address',
      'Are you sure?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await deleteData(id);

              if (response.success) {

                setAddressList(prev =>
                  prev.filter(item => item.id !== id)
                );

                Alert.alert('Success', 'Address deleted successfully');
              }

            } catch (err) {
              console.log('DELETE ERROR:', err);
              Alert.alert('Error', 'Unable to delete address');
            }
          }
        }
      ]
    );
  };

    // EDIT address

    const handleEdit = (item) =>{
      navigation.navigate('AddAddress',{
        address:item,
      });
    };


  return (
    <View style={{
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#F5F5F5'
    }}>

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
          fontWeight: 'bold',
          fontSize: 22,
          color: isDark ? '#fff' : '#000'
        }}>
          My Address
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("AddAddress")}
          style={{
            borderWidth: 1,
            borderColor: isDark ? '#555' : '#ccc',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
          }}>
          <Text style={{ color: isDark ? '#fff' : '#000' }}>
            + Add Address
          </Text>
        </TouchableOpacity>

      </View>

      {/* LOADING INDICATOR */}
      {loading ? (

        <ActivityIndicator
          size="large"
          color="#2E7D32"
          style={{ marginTop: 30 }}
        />

      ) : (

        /* FIXED: FLATLIST CONDITIONAL BLOCK */
        <FlatList
          data={addressList}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}

          ListEmptyComponent={
            <Text style={{
              textAlign: 'center',
              marginTop: 50,
              fontSize: 16,
              color: isDark ? '#aaa' : '#777'
            }}>
              No addresses found. Please add an address.
            </Text>
          }

          renderItem={({ item }) => (

            <View style={{
              marginHorizontal: 15,
              marginTop: 15,
              padding: 16,
              borderRadius: 18,
              backgroundColor: isDark ? '#1E1E1E' : '#fff',
              elevation: 5,
            }}>

              {/* TOP ROW */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 20 }}>📍</Text>

                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginLeft: 6,
                    color: isDark ? '#fff' : '#000'
                  }}>
                    {item.city}
                  </Text>
                </View>

                  {/* Edit delete */}
                  <View style={{ flexDirection:'row',
                    alignItems:'center',
                    gap:18,                  
                    }}>       

                    {/*  EDIT */}
                  <TouchableOpacity onPress={()=> handleEdit(item)}>
                    <Ionicons name="create-outline" size={22} color="#2196F3"/>
                    </TouchableOpacity>
                    
                            {/* DELETE*/}

                            <TouchableOpacity onPress={()=>handleDelete(item.id)}>
                              
                              <Ionicons name="trash-outline" size={22} color={isDark ?'#aaa': '#555'}/>
                              </TouchableOpacity>

              </View>
              </View>

              {/* ADDRESS LINE */}
              <Text style={{
                marginTop: 6,
                color: isDark ? '#bbb' : '#555'
              }}>
                {item.building}, {item.pincode}
              </Text>

              {/* BADGE */}
              <View style={{
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center'
              }}>

                {item.isDefault && (
                  <View style={{
                    backgroundColor: '#E8F5E9',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}>
                    <Text style={{
                      color: '#2E7D32',
                      fontWeight: 'bold',
                      fontSize: 12
                    }}>
                      Default
                    </Text>
                  </View>
                )}

              </View>

            </View>
            
          )}
         
    />
      )}

    </View>
  );
  
};

export default MYAddress;
