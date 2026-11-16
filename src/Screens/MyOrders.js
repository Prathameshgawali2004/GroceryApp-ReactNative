import React, {useContext,useState,useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  
} from 'react-native';
import { ThemeContext } from '../ThemeContext';
import { lightTheme, darkTheme } from '../ThemeColors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../config/api.js';
const MyOrders = () => {
  const [myOrders,setMyOrders] = useState([]) ;
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [cancellingId,setCancellingId] = useState(null);

  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(()=>{
    fetchMyOrders();
  },[]);

const fetchMyOrders = async() =>{
  try{
    const token = await AsyncStorage.getItem('TOKEN');
    if(!token){
      setError('Please login to view your orders.');
    return;
  }

  const response = await  fetch(`${BASE_URL}/orders`,{
   method: 'GET',
   headers:{
    Authorization: token,
   },
  });

  const data = await response.json();

  if(!response.ok || !data.success){
    
      throw new Error(data.message || 'failed to fetch orders');
        }

        setMyOrders(
          data.orders.map(order =>({
            ...order,
            total: order.total_amount,
            paymentId: order.payment_id,
            orderDate:order.created_at
            ? new Date(order.created_at).toLocaleDateString()
            : '',
            orderTime: order.created_at
            ? new Date(order.created_at) .toLocaleTimeString()
            :'',
            items: order.items.map(product =>({
              ...product,
              name:product.name,
             image:product.image,
            
            })),
          }))
        );
  }
  catch(err){
    console.log('FETCH ORDERS ERROR:',err);
    setError(err.message ||'unable to load orders,');
  } finally {
    setLoading(false);
  }
  
};

const cancelOrder = (orderId) =>{
  Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
          {
            text:'No',
            style:'cancel',
          },

          {
              text:'Yes, Cancel',
              style : 'destructive',
              onPress: async () => {
                try{
                  setCancellingId(orderId);
                
                const token = await AsyncStorage.getItem('TOKEN');

                const response = await  fetch(
                  `${BASE_URL}/orders/${orderId}/cancel`,
                  {
                    method:'PUT',
                    headers:{
                      Authorization:`Bearer ${token}`,
                      'Content-type':'application/json',
                    },
                  }
                );
                  const result = await response.json();
                  if(!response.ok || !result.success){
                    throw new Error(result.message || 'Failed to cancel order');
                  }

                  setMyOrders(prevOrders =>
                    prevOrders.map(order =>
                      order.id === orderId
                      ?{...order,status:'CANCELLED'}  
                      : order
                    )
                  );
                  Alert.alert('Success','order cancelled successfully');
                      } catch (error){
                        Alert.alert('Error', error.message);
                      } finally{
                          setCancellingId(null);
                      }
                    },
                  },
                ]
              )
  
}



if(loading){
  return(
    <SafeAreaView 
      style={[styles.emptyContainer,{backgroundColor:theme.background},
      ]}>

        <ActivityIndicator size="large" color="#FF6B00"/>
        <Text style={{ color:theme.text,marginTop:10}}>
          Loading orders.....
          </Text>
          </SafeAreaView>
  );
}

  if(error){
    return(
      <SafeAreaView style={[styles.emptyContainer,{backgroundColor:theme.background},   
      ]}>

    <Text style={{color: theme.text}}>{error}</Text>
      </SafeAreaView>
  )
}
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
    const trackingSteps =[
        'PLACED' ,
        'CONFIRMED',
         'SHIPPED', 
        'DELIVERED',
        ];

        const currentStep = trackingSteps.indexOf(item.status)

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
                Order Status:{' '}
  <Text
    style={{
      color:
        
  item.status === 'CANCELLED'
    ? '#D32F2F'
    : item.status === 'DELIVERED'
    ? '#2E7D32'
    : item.status === 'SHIPPED'
    ? '#1976D2'
    : '#F57C00',
      fontWeight: 'bold',
    }}
  >
    {item.status}
  </Text>
</Text>


    {/* ORDER TRACKING UI */}
    {item.status === 'CANCELLED' ?(
      <Text style={{color:'#D32F2F', marginTop:10, fontWeight:'bold'}}>
        ❌ This Order has been Cancelled
      </Text>
    ):(
      <View style={{ marginTop:15,padding:12,backgroundColor: theme.background, borderRadius:10}}>
        <Text style={{  fontSize: 17,
          fontWeight: 'bold',
         color:theme.text,
         marginBottom: 15,
        }}> Order Tracking
        </Text>
    
        {trackingSteps.map((step, index) => {
      const completed = index <= currentStep;

              return (
                <View key={step} style={{
                  flexDirection:'row',
                  alignItems: 'center',
                  marginBottom: 15,
                  }}>
                    <View style={{
                      width: 25,
                      height: 25,
                      borderRadius: 15,
                       backgroundColor: completed ?'#2E7D32' : '#BDBDBD',
                       justifyContent:'center',
                       alignItems: 'center',
                        }}>

                          <Text style={{ color:'#fff'}}>
                            {completed ? '✓' : index + 1}
                            </Text>
                        </View>

                        <Text style={{ marginLeft: 12,
                          color:theme.text, fontWeight: completed ? 'bold':'normal',
                        }}>
                          {step}
                        </Text>
                </View>
                )
              })}
              </View>
    )}

      

      {item.status ==='PLACED' && (
        <TouchableOpacity 
        disabled={cancellingId === item.id}
        onPress={() => cancelOrder(item.id)}
        style={{backgroundColor: '#3949AB',
          padding:12,
          borderRadius:10,
          marginTop: 15,
          alignItems:'center',
          opacity: cancellingId === item.id ? 0.6 : 1,
        }}>
          <Text style={{color:'#fff',fontWeight:'bold'}}>
            {cancellingId === item.id
              ?'Cancelling...'
              :'Cancel Order'}
          </Text>
        </TouchableOpacity>
      )}

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