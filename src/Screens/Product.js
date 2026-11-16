
import React, {
  useState,
  useRef,
  useEffect,
  useContext
} from 'react';

import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert
} from 'react-native';

import ProductItem from '../ProductItem';

import { CATEGORIES } from '../Data/Categories';
import { BANNERS } from '../Data/BannerData';

import {
  DrawerActions,
  useNavigation
} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { ThemeContext } from '../ThemeContext';

import {
  lightTheme,
  darkTheme
} from '../ThemeColors';

import { useDispatch } from 'react-redux';

import { addToCart } from '../Redux/cartSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api.js';

const Product = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { isDark, toggleTheme } = useContext(ThemeContext);

  const theme = isDark ? darkTheme : lightTheme;

  // STATES

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const bannerRef = useRef(null);

  const { width } = Dimensions.get('window');

  // AUTO BANNER

  useEffect(() => {

    if (BANNERS.length === 0) return;

    const timer = setInterval(() => {

      const next = (currentBanner + 1) % BANNERS.length;

      bannerRef.current?.scrollToIndex({
        index: next,
        animated: true
      });

      setCurrentBanner(next);

    }, 3000);

    return () => clearInterval(timer);

  }, [currentBanner]);

  // GET ALL PRODUCTS API

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        setLoading(true);

        const response = await fetch(`${BASE_URL}/products`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
          console.log('Invalid products response:', data);
        }

      } catch (error) {

        console.log('PRODUCT API ERROR:', error);

        Alert.alert(
          'Connection Error',
          'Products load nahi zale. Please backend check kara.'
        );

        setProducts([]);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  // CATEGORY + SEARCH FILTER

  const filteredProduct = products.filter(item => {

    const categoryMatch =
      selectedCategory === 'All' ||
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const searchMatch =
      item.name?.toLowerCase().includes(search.toLowerCase());

    return categoryMatch && searchMatch;

  });

  // SORT PRODUCTS

  const sortedProducts = [...filteredProduct];

  if (sortType === 'low') {

    sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));

  }

  if (sortType === 'high') {

    sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));

  }

  // CATEGORY STYLE

  const getChipStyle = selected => ({

    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    marginRight: 12,

    backgroundColor: selected
      ? '#3B82F6'
      : isDark
        ? '#1F2937'
        : '#E5E7EB',

    borderWidth: selected ? 0 : 1,

    borderColor: isDark ? '#374151' : '#ccc',

    elevation: selected ? 6 : 2

  });

  const getChipText = selected => ({

    color: selected
      ? '#fff'
      : isDark
        ? '#D1D5DB'
        : '#333',

    fontWeight: selected ? 'bold' : '600'

  });

  // ADD TO CART API

  const addToCartAPI = async item => {

    try {

      const token = await AsyncStorage.getItem('TOKEN');

      if (!token) {

        Alert.alert(
          'Login Required',
          'Please login to add products to cart.'
        );

        return;

      }

      const response = await fetch(`${BASE_URL}/cart`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },

        body: JSON.stringify({
          product_id: item.id,
          quantity: 1
        })

      });

      const data = await response.json();

      if (!response.ok) {

        throw new Error(data.message || 'Failed to add cart');

      }

      dispatch(addToCart(item));

      Alert.alert(
        'Success',
        data.message || 'Product added to cart 🛒'
      );

    } catch (error) {

      console.log('ADD CART ERROR:', error);

      Alert.alert(
        'Error',
        error.message || 'Unable to add product to cart.'
      );

    }

  };

  // UI

  return (

    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff'
      }}
    >

      {/* HEADER */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 15
        }}
      >

        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >

          <Ionicons
            name="menu"
            size={26}
            color={isDark ? '#fff' : '#000'}
          />

        </TouchableOpacity>

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            letterSpacing: 1,
            color: isDark ? '#fff' : '#000'
          }}
        >
          ShopEase
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
          }}
        >

          <TouchableOpacity onPress={toggleTheme}>

            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={22}
              color={isDark ? '#fff' : '#000'}
            />

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
          >

            <Ionicons
              name="person-circle-outline"
              size={28}
              color={isDark ? '#fff' : '#000'}
            />

          </TouchableOpacity>

        </View>

      </View>

      {/* PRODUCT LIST */}

      <FlatList

        data={sortedProducts}

        keyExtractor={item => item.id.toString()}

        numColumns={2}

        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 10
        }}

        renderItem={({ item }) => (

          <ProductItem
            item={item}
            buttonText="Add to Cart"
            onPressButton={() => addToCartAPI(item)}
          />

        )}

        showsVerticalScrollIndicator={false}

        ListEmptyComponent={() => {

          if (loading) {

            return (

              <View
                style={{
                  alignItems: 'center',
                  marginTop: 60
                }}
              >

                <Text
                  style={{
                    color: isDark ? '#fff' : '#000'
                  }}
                >
                  Loading products...
                </Text>

              </View>

            );

          }

          return (

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 60
              }}
            >

              <Text
                style={{
                  fontSize: 18,
                  color: isDark ? '#aaa' : '#555',
                  fontWeight: '600'
                }}
              >
                No results for "{search}"
              </Text>

              <Text
                style={{
                  fontSize: 13,
                  color: '#999',
                  marginTop: 5
                }}
              >
                Try searching something else
              </Text>

            </View>

          );

        }}

        // HEADER CONTENT

        ListHeaderComponent={

          <>

            {/* BANNERS */}

            <FlatList

              ref={bannerRef}

              horizontal

              pagingEnabled

              showsHorizontalScrollIndicator={false}

              data={BANNERS}

              keyExtractor={item => item.id.toString()}

              getItemLayout={(data, index) => ({

                length: width - 30,
                offset: (width - 30) * index,
                index

              })}

              renderItem={({ item }) => (

                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: width - 30,
                    height: 180,
                    borderRadius: 15,
                    marginHorizontal: 15
                  }}
                />

              )}

            />

            {/* DOTS */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 10
              }}
            >

              {BANNERS.map((item, index) => (

                <View
                  key={item.id}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,

                    backgroundColor:
                      currentBanner === index
                        ? isDark ? '#fff' : '#000'
                        : '#ccc'

                  }}
                />

              ))}

            </View>

            {/* SEARCH */}

            <TextInput

              placeholder="Search products"

              placeholderTextColor="#888"

              value={search}

              onChangeText={setSearch}

              style={{
                backgroundColor: isDark ? '#1E1E1E' : '#f2f2f2',
                marginHorizontal: 15,
                marginTop: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
                height: 45,
                color: isDark ? '#fff' : '#000'
              }}

            />

            {/* CATEGORY */}

            <FlatList

              horizontal

              showsHorizontalScrollIndicator={false}

              data={[
                { id: 0, name: 'All' },
                ...CATEGORIES
              ]}

              keyExtractor={item => item.id.toString()}

              contentContainerStyle={{
                padding: 15,
                paddingVertical: 12
              }}

              renderItem={({ item }) => {

                const selected =
                  selectedCategory === item.name;

                return (

                  <TouchableOpacity

                    activeOpacity={0.7}

                    onPress={() => setSelectedCategory(item.name)}

                    style={getChipStyle(selected)}

                  >

                    <Text style={getChipText(selected)}>
                      {item.name}
                    </Text>

                  </TouchableOpacity>

                );

              }}

            />

            {/* TITLE */}

            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                marginHorizontal: 15,
                color: isDark ? '#fff' : '#000'
              }}
            >

              {selectedCategory === 'All'
                ? 'All Products'
                : selectedCategory}

            </Text>

            {/* SORT */}

            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginHorizontal: 15,
                marginTop: 12,
                marginBottom: 10
              }}
            >

              {/* LOW TO HIGH */}

              <TouchableOpacity

                onPress={() => setSortType('low')}

                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,

                  backgroundColor:
                    sortType === 'low'
                      ? '#232f3e'
                      : isDark ? '#2a2a2a' : '#ddd'

                }}
              >

                <Text
                  style={{
                    textAlign: 'center',

                    color:
                      sortType === 'low'
                        ? '#fff'
                        : isDark ? '#fff' : '#000'
                  }}
                >
                  Price: Low → High
                </Text>

              </TouchableOpacity>

              {/* HIGH TO LOW */}

              <TouchableOpacity

                onPress={() => setSortType('high')}

                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,

                  backgroundColor:
                    sortType === 'high'
                      ? '#232f3e'
                      : isDark ? '#2a2a2a' : '#ddd'

                }}
              >

                <Text
                  style={{
                    textAlign: 'center',

                    color:
                      sortType === 'high'
                        ? '#fff'
                        : isDark ? '#fff' : '#000'
                  }}
                >
                  Price: High → Low
                </Text>

              </TouchableOpacity>

            </View>

          </>

        }

      />

    </View>

  );

};

export default Product;
