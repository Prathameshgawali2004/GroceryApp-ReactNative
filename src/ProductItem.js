import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from './Redux/Action/Action';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from './ThemeContext';

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
            🔥{item.discount}% OFF
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.heart,
          { backgroundColor: isDark ? '#2a2a2a' : '#fff' }
        ]}
        onPress={() => {
          if (isWishlist) {
            const index = wishlist.findIndex(
              data => data.id === item.id,
            );
            dispatch(removeFromWishlist(index));
          } else {
            dispatch(addToWishlist(item));
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
          ⭐ {item.rating}
        </Text>

        <Text style={{
          color: isDark ? '#aaa' : '#777',
          fontSize: 13,
          marginLeft: 5
        }}>
          ({item.reviews})
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
          ₹{item.oldPrice}
        </Text>
      </View>

      <View style={{ marginTop: 6 }}>
        {item.bestSeller ? (
          <View style={styles.bestSellerBadge}>
            <Text style={styles.bestSellerText}>
              🏆 Best Seller
            </Text>
          </View>
        ) : item.stock <= 5 ? (
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