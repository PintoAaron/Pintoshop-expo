import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Screen from './Screen';
import colors from '../config/colors';

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

const OrderDetailsScreen = ({ route }) => {
  const { order } = route.params;
  return (
    <Screen style={styles.screen}>
      <FlatList
        data={order.orderitems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {item.product.images && item.product.images.length > 0 && (
              <Image source={{ uri: item.product.images[0].image_url }} style={styles.itemImage} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.product.title}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              <Text style={styles.itemPrice}>Ghc {item.unit_price.toFixed(2)}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>Order #{order.id}</Text>
            <Text style={styles.sectionTitle}>Placed: {new Date(order.placed_at).toLocaleString()}</Text>
            <Text style={styles.sectionTitle}>Status: {ORDER_STATUS_MAP[order.status] || order.status}</Text>
            <Text style={styles.sectionTitle}>Payment Status: {PAYMENT_STATUS_MAP[order.payment_status] || order.payment_status}</Text>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Text style={styles.address}>{order.shipping_address.city}{order.shipping_address.street ? ', ' + order.shipping_address.street : ''}</Text>
            {order.shipping_address.landmark ? <Text style={styles.address}>Landmark: {order.shipping_address.landmark}</Text> : null}
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.address}>{order.payment_wallet.title} ({order.payment_wallet.service_provider})</Text>
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light, padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: colors.primary },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: colors.dark },
  address: { color: colors.grey, fontSize: 15, marginBottom: 2 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.grey },
  itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  itemTitle: { fontWeight: 'bold', fontSize: 16 },
  itemQty: { color: colors.grey, fontSize: 14 },
  itemPrice: { color: colors.primary, fontWeight: 'bold', fontSize: 15 },
});

export default OrderDetailsScreen;
