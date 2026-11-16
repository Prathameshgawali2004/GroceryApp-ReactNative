import { Text, View, TouchableOpacity, FlatList, Image, Alert, StyleSheet, SafeAreaView, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useContext,useCallback,useState } from 'react';
import { addItemToCart, removeFromWishlist,setWishlist} from '../Redux/Action/Action';
import { ThemeContext } from '../ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api';
import {useDispatch} from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';




const Wishlist = () => {

    const [wishlistData,setWishlistData] = useState([]);
    const [loading,setLoading] = useState(false);

    const dispatch = useDispatch();
    const { isDark } = useContext(ThemeContext);
    const fetchWishlist = async () => {
        try{
                setLoading(true);
                const  token = await AsyncStorage.getItem('TOKEN');

console.log("TOKEN:", token);
                const response = await fetch(`${BASE_URL}/wishlist`,{
                    method:'GET',
                    headers:{
                        Authorization:token,
                    },
                }); 

                const result = await response.json();
                console.log("WISHLIST STATUS:", response.status);
               console.log('WISHLIST API RESPONSE:', result);
                 if (!response.ok){
                    throw  new Error(result.message || 'Failed to fecth wishlist');
                         }   
                         
                      const wishlist = result.wishlist || [];
                      console.log('WISHLIST DATA:', wishlist);

                    setWishlistData(wishlist);
                    dispatch(setWishlist(wishlist));

                        } catch(error){
                            console.log('FETCH WISHLIST ERROR:',error);
                            Alert.alert("Error",error.message);
                        } finally{
                            setLoading(false);
                        }
                        }

                        useFocusEffect(                       
                        useCallback(()=>{
                        fetchWishlist();
                            },[]) );

                            const handleRemoveWishlist = async (productId) => {
                                try {
                                const token = await AsyncStorage.getItem('TOKEN');
                                    if(!token){
                                        Alert.alert('Login Required','Please login first');
                                        return;
                                    }

                                 const response = await fetch(`${BASE_URL}/wishlist/${productId}`,
                                    {
                                        method:'DELETE',
                                        headers:{
                                            Authorization:token,
                                            Accept:'application/json',
                                        },
                                    }
                                 );
                                

                                const result = await response.json();

                                if(!response.ok){
                                    throw new Error(result.message ||'Failed to remove product');
                                }

                                    setWishlistData(prev =>
                                        prev.filter(item => item.id !== productId)
                                    );
                                    dispatch(removeFromWishlist(productId));

                                    Alert. alert('Success','Product removed from wishlist');


                                } catch(error){
                                    console.log("REMOVE WISHLIST ERROR:", error);
                                    Alert.alert('Error', error.message);

                                    }
                            };

                            const handleMoveTocart = async (item)=>{
                                try{
                                    const token = await AsyncStorage.getItem('TOKEN');
                                    if(!token){
                                        Alert.alert('Login required', 'Please login first');
                                        return;
                            }

                            // Step 1: Add product to Backend Cart
                            const cartResponse = await fetch(`${BASE_URL}/cart`,{
                            method:'POST',
                             headers:{
                                Authorization:token,
                                'Content-Type':'application/json',
                                Accept:'application/json',
                             },
                             
                             body:JSON.stringify({
                                product_id: item.id,
                                quantity: 1,
                             }),
                             });

                             const cartResult = await cartResponse.json();
                             if(!cartResponse.ok){
                                throw new Error(cartResult.message || 'Failed to add product to cart');
                             }

                        // Step 2: Remove product from Backend Wishlist

                        const response = await fetch(`${BASE_URL}/wishlist/${item.id}`,{
                                method:'DELETE',
                                headers:{
                                    Authorization:token,
                                    Accept:'application/json',
                                },
                        });

                        const result = await response.json();
                        if(!response.ok){
                            throw new Error(result.message ||'Failed to remove from wishlist');
                        }
                        
                        // Step 3: Update Redux Cart
                            dispatch(addItemToCart({
                                ...item,
                                quantity:1,
                            }));

                           
                        // Step 4: Update wishlist UI
                                
                                setWishlistData(prev =>
                                    prev.filter(product => product.id!==item.id)
                                );
                                dispatch(removeFromWishlist(item.id));
                                Alert.alert('Success','Product moved to cart successfully');

                            } catch(error){
                                console.log("MOVE TO CART ERROR:",error);
                                Alert.alert('Error',error.message);
                            }
                        };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: isDark ? '#121212' : '#fff'
        }}>

            {/* HEADER */}
            <View style={{
                height: 60,
                paddingHorizontal: 18,
                justifyContent: 'center',
                borderBottomWidth: 1,
                borderBottomColor: isDark ? '#333' : '#ddd',
            }}>
                <Text style={{
                    fontSize: 22,
                    fontWeight: '700',
                    color: isDark ? '#fff' : '#000'
                }}>
                    My Wishlist
                </Text>
            </View>

            <FlatList
                data={wishlistData}
                keyExtractor={(item, index) => item.id + "_" + index}
                showsVerticalScrollIndicator={false}

                ListEmptyComponent={() => (
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: 120,
                    }}>

                        <Ionicons
                            name="heart-outline"
                            size={70}
                            color={isDark ? '#555' : '#999'}
                        />

                        <Text style={{
                            marginTop: 10,
                            fontSize: 18,
                            fontWeight: '600',
                            color: isDark ? '#aaa' : '#666',
                            textAlign: 'center'
                        }}>
                            Your Wishlist is Empty
                        </Text>

                        <Text style={{
                            color: isDark ? '#777' : '#999',
                            marginTop: 5
                        }}>
                            Save items you like and buy them later.
                        </Text>
                    </View>
                )}

                renderItem={({ item, index }) => (

                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 12,
                        backgroundColor: isDark ? '#1E1E1E' : '#fff',
                        borderRadius: 10,
                        elevation: 3,
                        padding: 10,
                    }}>


                        <Image
                            source={{ uri: item.image }}
                            style={{
                                width: 85,
                                height: 85,
                                borderRadius: 10,
                                resizeMode: 'contain',
                            }}
                        />

                        <View style={{ flex: 1, marginLeft: 15 }}>

                            {/* NAME */}
                            <Text
                                numberOfLines={2}
                                style={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: isDark ? '#fff' : '#000'
                                }}>
                                {item.name}
                            </Text>

                            {/* PRICE */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 8
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    color: '#1B8F3D',
                                    fontWeight: 'bold',
                                }}>
                                    ₹{item.price}
                                </Text>

                                <Text style={{
                                    marginLeft: 8,
                                    fontSize: 15,
                                    textDecorationLine: 'line-through',
                                    color: '#888'
                                }}>
                                    ₹{item.oldPrice}
                                </Text>

                                <Text style={{
                                    marginLeft: 8,
                                    fontSize: 14,
                                    fontWeight: '700',
                                    color: '#1B8F3D'
                                }}>
                                    {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
                                </Text>
                            </View>

                            {/* BUTTON */}
                            <TouchableOpacity
                                style={[
                                    styles.moveBtn,
                                    { backgroundColor: isDark ? '#0d47a1' : '#2874F0' }
                                ]}
                                onPress={() => {
                                    Alert.alert(
                                        "Move to Cart",
                                        "Move this item to cart?",
                                        [
                                            { text: "Cancel", 
                                                style: "cancel"
                                             },
                                            {
                                                text: "Yes",
                                                onPress: () => handleMoveTocart(item),
                                                 
                                                },
                                            
                                        ],
                                    );
                                }}
                            >
                                <Ionicons name="cart-outline" size={18} color="#fff" />
                                <Text style={styles.moveText}> Move to Cart</Text>
                            </TouchableOpacity>
                        </View>

                        {/* REMOVE */}
                        <TouchableOpacity
                            onPress={() => handleRemoveWishlist(item.id)}
                        >
                            <Ionicons name="heart" size={28} color="red" />
                        </TouchableOpacity>

                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default Wishlist;

const styles = StyleSheet.create({
    moveBtn: {
        marginTop: 10,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    moveText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 6,
        fontSize: 15,
    },
});