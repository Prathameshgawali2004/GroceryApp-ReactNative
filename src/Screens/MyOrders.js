import React, { useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../ThemeContext';
import { lightTheme, darkTheme } from '../ThemeColors';

const MyOrders = () => {
  const myOrders = useSelector(state => state.orders);

  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? darkTheme : lightTheme;

  if (myOrders.length === 0) {
    return (
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          📦 No Orders Yet
        </Text>
      </SafeAreaView>
    );
  }

  const renderOrder = ({ item }) => {
    return (
      <View style={[styles.orderCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.heading, { color: theme.text }]}>
          Order Details
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          <Text style={styles.bold}>Total:</Text> ₹{item.total}
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          <Text style={styles.bold}>Address:</Text> {item.address}
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          <Text style={styles.bold}>Payment ID:</Text> {item.paymentId}
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          💳 <Text style={styles.bold}>Payment Status:</Text>
          <Text style={{ color: 'green', fontWeight: 'bold' }}> Paid</Text>
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          📅 <Text style={styles.bold}>Date:</Text> {item.orderDate}
        </Text>

        <Text style={[styles.text, { color: theme.text }]}>
          🕒 <Text style={styles.bold}>Time:</Text> {item.orderTime}
        </Text>

        <FlatList
          data={item.items}
          keyExtractor={(item, index) => item.id + "_" + index}
          renderItem={({ item: product }) => (
            <View style={[styles.productCard, { borderColor: theme.border }]}>
              <Image source={{ uri: product.image }} style={styles.image} />

              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={[styles.productName, { color: theme.text }]}>
                  {product.name}
                </Text>

                <Text style={styles.price}>
                  ₹{product.price}
                </Text>

                <Text style={[styles.quantity, { color: theme.text }]}>
                  Quantity :
                  <Text style={styles.quantityValue}> {product.quantity}</Text>
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <FlatList
        data={myOrders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 15 }}
      />
    </SafeAreaView>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  orderCard: {
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
    marginBottom: 5,
  },

  bold: {
    fontWeight: 'bold',
  },

  productCard: {
    flexDirection: 'row',
    marginTop: 15,
    borderTopWidth: 0.5,
    paddingTop: 10,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },

  productName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  price: {
    fontSize: 16,
    color: 'green',
    marginTop: 5,
  },

  quantity: {
    fontSize: 15,
    marginTop: 5,
    fontWeight: '600',
  },

  quantityValue: {
    color: '#FF6B00',
    fontWeight: 'bold',
  },
});