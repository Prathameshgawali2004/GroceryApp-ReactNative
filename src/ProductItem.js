import React,{useContext} from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from './Redux/Action/Action';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';
import BASE_URL from './config/api'; // 
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductItem = ({ item, buttonText, onPressButton }) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist);

  const { isDark } = useContext(ThemeContext);

  const isWishlist = wishlist.some(data => data.id === item.id);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isDark ? '#1E1E1E' : '#fff' }
      ]}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("ProductDetails", { product: item })
      }
    >

      <View>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
           🔥{item.discount || 10}% OFF
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.heart,
          { backgroundColor: isDark ? '#2a2a2a' : '#fff' }
        ]}
        onPress={async () => {
          try{
            const token = await AsyncStorage.getItem('TOKEN');

            if(!token){
              Alert.alert('Login Required', 'Please login first');
              return;
            }

            if(isWishlist){
                 // Remove from wishlist
              const response =  await fetch(
                `${BASE_URL}/wishlist/${item.id}`,
                {
                  method:'DELETE',
                  headers:{
                    Authorization:token,
                  },
                },
              );
                  

      dispatch(removeFromWishlist(item.id));

                  Alert.alert('Success','Product removed  from wishlist');

                }else{
                      // Add to wishlist
                  const response = await fetch(`${BASE_URL}/wishlist`,{
                  method:'POST',
                  headers:{
                    'Content-Type':'application/json',
                    Authorization:token,
                  },

                body: JSON.stringify({
                    product_id: item.id,
                  }),
                });
                  

                  const result = await response.json();

                  if(!response.ok){
                    throw  new Error(result.message ||'Failed to add wishlist');
                  }
                    dispatch(addToWishlist(item));

                    Alert.alert('Success','Product added to wishlist');
                  }

            } catch (error) {
              console.log('WISHLIST ERROR:', error);
                Alert.alert('Error', error.message|| 'Something went wrong');
            }
            
          
         
        }}>
        <Ionicons
          name={isWishlist ? 'heart' : 'heart-outline'}
          size={24}
          color="red"
        />
      </TouchableOpacity>

      <Text style={[
        styles.name,
        { color: isDark ? '#fff' : '#000' }
      ]}>
        {item.name}
      </Text>

      <View style={styles.row}>
        <Text style={{ color: "#f08804", fontWeight: '600' }}>
      ⭐ {item.rating || 4.2}
        </Text>

        <Text style={{
          color: isDark ? '#aaa' : '#777',
          fontSize: 13,
          marginLeft: 5
        }}>
         ({item.reviews || 120})
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={{
          fontSize: 15,
          fontWeight: 'bold',
          color: isDark ? '#fff' : '#000'
        }}>
          ₹{item.price}
        </Text>

        <Text style={styles.oldPrice}>
          ₹{item.oldPrice || item.price + 200}
        </Text>
      </View>

      <View style={{ marginTop: 6 }}>
        {item.bestSeller ? (
          <View style={styles.bestSellerBadge}>
            <Text style={styles.bestSellerText}>
              🏆 Best Seller
            </Text>
          </View>
        ) : (item.stock || 10) <= 5 ? (
          <Text style={{ color: '#d32f2f', fontSize: 12 }}>
            🔥 Only {item.stock} Left
          </Text>
        ) : (
          <Text style={{ color: '#2e7d32', fontSize: 12 }}>
            ✅ In Stock({item.stock})
          </Text>
        )}
      </View>

      <View style={styles.row}>
        <Ionicons name="car-outline" size={14} color="#1B8F3D" />
        <Text style={{ color: '#1B8F3D', fontSize: 12, marginLeft: 4 }}>
          Free Delivery
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onPressButton}
      >
        <Text style={styles.buttonText}>
          {buttonText}
        </Text>
      </TouchableOpacity>

    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 340,
    margin: 6,
    padding: 8,
    borderRadius: 12,
    elevation: 3,
    justifyContent: 'space-between',
  },

  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },

  name: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },

  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginLeft: 6,
    fontSize: 13,
  },

  button: {
    marginTop: 8,
    backgroundColor: '#ffd814',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#000',
    fontWeight: '600',
  },

  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 10,
    backgroundColor: "#E53935",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },

  discountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  bestSellerBadge: {
    backgroundColor: '#009688',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 6,
  },

  bestSellerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});