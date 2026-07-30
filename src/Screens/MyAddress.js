import React, { useContext } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAddress } from '../Redux/Action/Action';
import { ThemeContext } from '../ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { deleteData } from '../services/api';

const MYAddress = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const addressList = useSelector(state => state.addressList);
  const { isDark } = useContext(ThemeContext);

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

      {/* LIST */}
      <FlatList
        data={addressList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}

        renderItem={({ item, index }) => (
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

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

              {/* DELETE */}
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Delete Address",
                    "Are you sure?",
                    [
                      { text: "Cancel" },
                      {
                        text: "Delete",
                        onPress: async () => {
                          try {
                            await deleteData(item.id);
                            dispatch(deleteAddress(index));
                          } catch (err) {
                            console.log(err);
                          }
                        }
                      }
                    ]
                  );
                }}>
                <Ionicons name="trash-outline" size={22} color={isDark ? '#aaa' : '#555'} />
              </TouchableOpacity>

            </View>

            {/* ADDRESS LINE  */}
            <Text style={{
              marginTop: 6,
              color: isDark ? '#bbb' : '#555'
            }}>
              {item.building}, {item.PinCode}
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

    </View>
  )
}

export default MYAddress;