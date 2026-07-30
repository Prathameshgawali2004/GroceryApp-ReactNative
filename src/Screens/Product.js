import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions
} from 'react-native';

import ProductItem from '../ProductItem';
import { CATEGORIES } from '../Data/Categories';
import { PRODUCT } from '../Data/ProductData';
import { BANNERS } from '../Data/BannerData';

import { DrawerActions, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../Redux/Action/Action';

import { ThemeContext } from '../ThemeContext';
import { lightTheme, darkTheme } from '../ThemeColors';

const Product = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { isDark, toggleTheme } = useContext(ThemeContext);
  const theme = isDark ? darkTheme : lightTheme;

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);

  const bannerRef = useRef();
  const { width } = Dimensions.get('window');


  // AUTO BANNER
  useEffect(() => {
    const timer = setInterval(() => {
      let next = currentBanner + 1;
      if (next >= BANNERS.length) next = 0;

      bannerRef.current?.scrollToIndex({ index: next, animated: true });
      setCurrentBanner(next);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentBanner]);

  // FILTER
  const filteredProduct = PRODUCT.filter(item =>
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // SORT
  const sortedProducts = [...filteredProduct];
  if (sortType === 'low') sortedProducts.sort((a, b) => a.price - b.price);
  if (sortType === 'high') sortedProducts.sort((a, b) => b.price - a.price);

  const getChipStyle = (selected) => ({
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

    elevation: selected ? 6 : 2,
  });

  const getChipText = (selected) => ({
    color: selected
      ? '#fff'
      : isDark
        ? '#D1D5DB'
        : '#333',

    fontWeight: selected ? 'bold' : '600',
  });


  return (
    <View style={{
      flex: 1, backgroundColor: isDark ?
        '#121212' : '#fff'
    }}>


      {/* HEADER */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15
      }}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={26} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>

        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          letterSpacing: 1,
          color: isDark ? '#fff' : '#000'
        }}>
          ShopEase
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>

          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={22}
              color={isDark ? '#fff' : '#000'}
            />
          </TouchableOpacity>

          <Ionicons
            name="person-circle-outline"
            size={28}
            color={isDark ? '#fff' : '#000'}
          />
        </View>
      </View>

      {/* LIST */}
      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 60
            }}>

            <Text
              style={{
                fontSize: 18,
                color: isDark ? '#aaa' : '#555',
                fontWeight: '600'
              }}>
              No results for "{search}"
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: '#999',
                marginTop: 5
              }}>
              Try searching something else
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          paddingHorizontal: 10
        }}

        ListHeaderComponent={
          <>
            {/* BANNERS */}
            <FlatList
              ref={bannerRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={BANNERS}
              keyExtractor={(item) => item.id.toString()}
              getItemLayout={(data, index) => ({
                length: width - 30,
                offset: (width - 30) * index,
                index,
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
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              {BANNERS.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor:
                      currentBanner === index ?
                        isDark ? '#fff' : '#000'
                        : '#ccc'
                  }}
                />
              ))}
            </View>

            {/* SEARCH */}
            <TextInput
              placeholder="Search products"
              placeholderTextColor={isDark ? '#888' : '#888'}
              value={search}
              onChangeText={setSearch}
              style={{
                backgroundColor: isDark ? '#1E1E1E' : '#f2f2f2',
                marginHorizontal: 15,
                marginTop: 15,
                borderRadius: 8,
                paddingHorizontal: 15,
                height: 45,
                color: isDark ? '#fff' : '#000',
              }}
            />

            {/* CATEGORY */}
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[{ id: 0, name: 'All' }, ...CATEGORIES]}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 15, paddingVertical: 12 }}
              renderItem={({ item }) => {
                const selected = selectedCategory === item.name;

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
            <Text style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginHorizontal: 15,
              color: isDark ? '#fff' : '#000'
            }}>
              {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            </Text>

            {/* SORT */}
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                marginHorizontal: 15,
                marginBottom: 10
              }}>

              <TouchableOpacity
                onPress={() => setSortType('low')}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  backgroundColor:
                    sortType === 'low' ?
                      '#232f3e'
                      : isDark ? '#2a2a2a' : '#ddd'
                }}>

                <Text
                  style={{
                    textAlign: 'center',
                    color: sortType === 'low' ? '#fff' : isDark ? '#fff' : '#000'
                  }}>
                  Price: Low → High
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSortType('high')}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 6,
                  backgroundColor: sortType === 'high'
                    ? '#232f3e'
                    : isDark
                      ? '#2a2a2a'
                      : '#ddd'
                }}>
                <Text style={{ textAlign: 'center', color: sortType === 'high' ? '#fff' : '#000' }}>
                  Price: High → Low
                </Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            buttonText="Add to Cart"
            onPressButton={() =>
              dispatch(addItemToCart({ ...item, quantity: 1 }))
            }
          />
        )}
      />
    </View>
  );
};

export default Product;