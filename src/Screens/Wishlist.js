import { Text, View, TouchableOpacity, FlatList, Image, Alert, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeFromWishlist } from '../Redux/Action/Action';
import { ThemeContext } from '../ThemeContext';

const Wishlist = () => {

    const dispatch = useDispatch();
    const data = useSelector(state => state.wishlist);
    const { isDark } = useContext(ThemeContext);

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
                data={data}
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
                                            { text: "Cancel", style: "cancel" },
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    dispatch(addItemToCart({
                                                        ...item,
                                                        quantity: 1,
                                                    }));
                                                    dispatch(removeFromWishlist(index));
                                                },
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
                            onPress={() => dispatch(removeFromWishlist(index))}
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