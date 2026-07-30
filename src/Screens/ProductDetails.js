import React, { useState, useContext } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  addItemToCart,
  addToWishlist,
  removeFromWishlist
} from '../Redux/Action/Action';

import { ThemeContext } from '../ThemeContext';

const ProductDetails = ({ route }) => {

  const { product } = route.params;

  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const wishlist = useSelector(state => state.wishlist);

  const { isDark } = useContext(ThemeContext);

  const isWishlist = wishlist.some(
    item => item.id === product.id
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#fff' }}
      contentContainerStyle={{ padding: 15 }}
    >

      {/* IMAGE */}
      <View>
        <Image
          source={{ uri: product.image }}
          style={{
            width: '100%',
            height: 240,
            borderRadius: 15
          }}
        />

        {/* BACK */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: 15,
            left: 15,
            width: 45,
            height: 45,
            borderRadius: 22,
            backgroundColor: isDark ? '#2a2a2a' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}>
          <Ionicons name="arrow-back" size={22} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>

        {/* WISHLIST */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            width: 45,
            height: 45,
            borderRadius: 22,
            backgroundColor: isDark ? '#2a2a2a' : '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
          }}
          onPress={() => {
            if (isWishlist) {
              const index = wishlist.findIndex(
                item => item.id === product.id
              );
              dispatch(removeFromWishlist(index));
            } else {
              dispatch(addToWishlist(product));
            }
          }}
        >
          <Ionicons
            name={isWishlist ? "heart" : "heart-outline"}
            size={28}
            color="red"
          />
        </TouchableOpacity>
      </View>

      {/* NAME */}
      <Text style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        color: isDark ? '#fff' : '#000'
      }}>
        {product.name}
      </Text>

      {/* CATEGORY */}
      <Text style={{
        color: isDark ? '#aaa' : '#777',
        fontSize: 15,
        marginTop: 4
      }}>
        {product.category}
      </Text>

      {/* DISCOUNT */}
      <View style={{
        backgroundColor: '#E53935',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 15,
        marginBottom: 15,
      }}>
        <Text style={{
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 18,
        }}>
          🔥 {product.discount}% OFF
        </Text>
      </View>

      {/* PRICE */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      }}>
        <Text style={{
          fontSize: 36,
          color: "green",
          fontWeight: 'bold',
        }}>
          ₹{product.price}
        </Text>

        <Text style={{
          marginLeft: 10,
          fontSize: 18,
          color: 'gray',
          textDecorationLine: 'line-through',
        }}>
          ₹{product.oldPrice}
        </Text>
      </View>

      {/* RATING */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
      }}>
        <Text style={{
          fontWeight: 'bold',
          color: '#f4B400',
          fontSize: 22,
        }}>
          ⭐ {product.rating}
        </Text>

        <Text style={{
          marginLeft: 8,
          color: isDark ? '#aaa' : 'gray',
          fontSize: 18,
        }}>
          ({product.reviews} Reviews)
        </Text>
      </View>

      {/* BEST SELLER */}
      {product.bestSeller && (
        <View
          style={{
            backgroundColor: "#009688",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 6,
            alignSelf: 'flex-start',
            marginBottom: 12,
          }}>
          <Text
            style={{
              color: "#fff",
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            🏆 Best Seller
          </Text>
        </View>)}

      {/* STOCK */}
      {
        product.stock <= 5 ? (
          <Text
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 10,
            }}>
            🔥 Only {product.stock} Left
          </Text>
        ) : (
          <Text
            style={{
              color: "green",
              fontWeight: "bold",
              fontSize: 20,
              marginBottom: 25,
            }}> ✅ In Stock
            ({product.stock})
          </Text>
        )}

      {/* DESCRIPTION */}
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        color: isDark ? '#fff' : '#000'
      }}>
        Description
      </Text>

      <Text style={{
        fontSize: 16,
        color: isDark ? '#ccc' : '#555',
        marginTop: 10,
        lineHeight: 24,
        backgroundColor: isDark ? '#1E1E1E' : '#FAFAFA',
        padding: 15,
        borderRadius: 12,
      }}>
        {product.description}
      </Text>

      {/* EXTRA INFO */}
      <View
        style={{
          marginTop: 25,
          backgroundColor: '#F8F8F8',
          padding: 15,
          borderRadius: 10,
        }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10
          }}>
          🚚 Free Delivery
        </Text>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 10
          }}>
          🔄 7 Days Easy Return
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: 'green',
            fontWeight: 'bold'
          }}>
          ✅ In Stock
        </Text>

      </View>
      {/* QUANTITY */}
      <Text style={{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        color: isDark ? '#fff' : '#000'
      }}>
        Quantity
      </Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        borderWidth: 1.5,
        borderColor: isDark ? '#444' : '#ddd',

        borderRadius: 30,
        paddingHorizontal: 8,

        height: 50,
        width: 140,

        alignSelf: 'flex-start',
        marginTop: 12,
      }}>

        {/* MINUS */}
        <TouchableOpacity
          onPress={decreaseQuantity}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: isDark ? '#2A2A2A' : '#f2f2f2',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000'
          }}>
            -
          </Text>
        </TouchableOpacity>

        {/* VALUE */}
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: isDark ? '#fff' : '#000',
          minWidth: 30,
          textAlign: 'center'
        }}>
          {quantity}
        </Text>

        {/* PLUS */}
        <TouchableOpacity
          onPress={increaseQuantity}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: isDark ? '#2A2A2A' : '#f2f2f2',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000'
          }}>
            +
          </Text>
        </TouchableOpacity>

      </View>



      {/* ADD TO CART */}
      <TouchableOpacity
        onPress={() => {
          dispatch(addItemToCart({
            ...product,
            quantity: quantity,
          }));

          navigation.navigate("MainDrawer", {
            screen: "Home",
            params: { screen: "Cart", }
          });
        }}
        style={{
          backgroundColor: '#000',
          height: 50,
          marginTop: 30,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: 'bold',
        }}>
          Add To Cart
        </Text>
      </TouchableOpacity>

      {/* BUY NOW */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Checkout", {
            buyNow: true,
            product: {
              ...product,
              quantity: quantity,
            },
          });
        }}
        style={{
          backgroundColor: '#FF6B00',
          height: 50,
          marginTop: 15,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          Buy Now
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default ProductDetails;

