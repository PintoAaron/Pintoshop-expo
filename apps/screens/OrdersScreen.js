import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Screen from './Screen';
import colors from '../config/colors';
import shopApi from '../api/shop';
import { useNavigation } from '@react-navigation/native';

const ORDER_STATUS_MAP = {
  P: 'Pending',
  S: 'Shipped',
  O: 'Out for Delivery',
  D: 'Delivered',
  C: 'Completed',
  F: 'Failed',
};

const PAYMENT_STATUS_MAP = {
  P: 'Pending',
  F: 'Failed',
  C: 'Completed',
};

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const res = await shopApi.getOrders();
    if (res.ok) setOrders(res.data);
    setLoading(false);
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('OrderDetails', { order: item })}>
      <Text style={styles.orderId}>Order #{item.id}</Text>
      <Text style={styles.orderDate}>Placed: {new Date(item.placed_at).toLocaleString()}</Text>
      <Text style={styles.orderStatus}>Status: {ORDER_STATUS_MAP[item.status] || item.status}</Text>
      <Text style={styles.orderStatus}>Payment: {PAYMENT_STATUS_MAP[item.payment_status] || item.payment_status}</Text>
      <Text style={styles.orderItems}>Items: {item.orderitems.length}</Text>
    </TouchableOpacity>
  );

  if (loading) return <Screen style={styles.screen}><ActivityIndicator size="large" color={colors.primary} /></Screen>;

  return (
    <Screen style={styles.screen}>
      <Text style={styles.header}>My Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders found.</Text>}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light, padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: colors.primary },
  orderCard: { backgroundColor: colors.white, borderRadius: 10, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.grey },
  orderId: { fontWeight: 'bold', fontSize: 16 },
  orderDate: { color: colors.grey, fontSize: 14 },
  orderStatus: { color: colors.primary, fontWeight: 'bold', marginTop: 4 },
  orderItems: { color: colors.dark, marginTop: 2 },
  emptyText: { color: colors.grey, fontStyle: 'italic', marginTop: 40, textAlign: 'center' },
});

export default OrdersScreen;
