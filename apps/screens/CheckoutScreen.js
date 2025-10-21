import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Modal, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from './Screen';
import colors from '../config/colors';
import shopApi from '../api/shop';
import cartApi from '../api/cart';
import addressApi from '../api/addresses';
import mobileWalletsApi from '../api/mobileWallets';
import useAuth from '../hooks/useAuth';
import { useNavigation, useRoute } from '@react-navigation/native';
import MobileWalletsScreen from './MobileWalletsScreen';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartId, cartItems } = route.params || {};
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAddressesAndWallets();
  }, []);

  const loadAddressesAndWallets = async () => {
    setLoading(true);
    try {
      // Fetch addresses for the current customer
      let addressRes = { ok: false, data: [] };
      let walletRes = { ok: false, data: [] };
      const customer = await shopApi.getCustomerMe();
      if (customer) {
        addressRes = await addressApi.getAddresses(customer.data.id);
        walletRes = await mobileWalletsApi.getMobileWallets(customer.data.id);
      }
      console.log("addressRes", addressRes);
      console.log("walletRes", walletRes);
      if (addressRes.ok) setAddresses(addressRes.data);
      if (walletRes.ok) setWallets(walletRes.data);
    } catch (e) {
      Alert.alert('Error', 'Failed to load addresses or wallets.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedWallet) {
      Alert.alert('Missing Info', 'Please select a shipping address and payment wallet.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await shopApi.createOrder({
        cart_id: cartId,
        shipping_address_id: selectedAddress.id,
        payment_wallet_id: selectedWallet.id,
      });
      if (res.ok) {
        Alert.alert('Order Placed', 'Your order was placed successfully!\nIt will be delivered in 15 days.', [
          { text: 'OK', onPress: () => navigation.popToTop() },
        ]);
      } else {
        Alert.alert('Order Failed', 'Could not place order. Please try again.');
      }
    } catch (e) {
      Alert.alert('Order Failed', 'Could not place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Screen style={styles.screen}><ActivityIndicator size="large" color={colors.primary} /></Screen>;
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Checkout</Text>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <TouchableOpacity
          style={[styles.selectField, selectedAddress && styles.selectedFieldDim]}
          onPress={() => setAddressModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.selectFieldRow}>
            <Text style={styles.selectFieldText}>
              {selectedAddress
                ? `${selectedAddress.city}${selectedAddress.street ? ', ' + selectedAddress.street : ''}`
                : 'Select Address'}
            </Text>
            {selectedAddress && (
              <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} style={{ marginLeft: 8 }} />
            )}
          </View>
        </TouchableOpacity>
        <Modal
          visible={addressModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setAddressModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <FlatList
                data={addresses}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalItem, selectedAddress?.id === item.id && styles.selectedModalItem]}
                    onPress={() => {
                      setSelectedAddress(item);
                      setAddressModalVisible(false);
                    }}
                  >
                    <View style={styles.modalItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.city}</Text>
                        <Text style={styles.cardSub}>{item.street}</Text>
                        {item.gps ? <Text style={styles.cardSub}>GPS: {item.gps}</Text> : null}
                        {item.landmark ? <Text style={styles.cardSub}>Landmark: {item.landmark}</Text> : null}
                      </View>
                      {selectedAddress?.id === item.id && (
                        <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No addresses found.</Text>}
              />
              <TouchableOpacity onPress={() => setAddressModalVisible(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity
          style={[styles.selectField, selectedWallet && styles.selectedFieldDim]}
          onPress={() => setWalletModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.selectFieldRow}>
            <Text style={styles.selectFieldText}>
              {selectedWallet
                ? `${selectedWallet.title} (${selectedWallet.service_provider})`
                : 'Select Payment Method'}
            </Text>
            {selectedWallet && (
              <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} style={{ marginLeft: 8 }} />
            )}
          </View>
        </TouchableOpacity>
        <Modal
          visible={walletModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setWalletModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <FlatList
                data={wallets}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalItem, selectedWallet?.id === item.id && styles.selectedModalItem]}
                    onPress={() => {
                      setSelectedWallet(item);
                      setWalletModalVisible(false);
                    }}
                  >
                    <View style={styles.modalItemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardSub}>{item.service_provider} - {item.phone_number}</Text>
                        <Text style={[styles.cardSub, { color: item.verified ? 'green' : 'red' }]}>{item.verified ? 'Verified' : 'Not Verified'}</Text>
                      </View>
                      {selectedWallet?.id === item.id && (
                        <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No wallets found.</Text>}
              />
              <TouchableOpacity onPress={() => setWalletModalVisible(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.cardList}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.item}>
              <Text>{item.product.title} x {item.quantity}</Text>
              <Text>Ghc {item.product.unit_price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.estimate}>Will be delivered in 15 days</Text>
        <TouchableOpacity style={styles.button} onPress={handlePlaceOrder} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Placing Order...' : 'Place Order'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.light, padding: 16 },
  selectField: { backgroundColor: colors.white, borderRadius: 8, borderWidth: 1, borderColor: colors.grey, padding: 14, marginBottom: 12 },
  selectFieldRow: { flexDirection: 'row', alignItems: 'center' },
  selectFieldText: { fontSize: 16, color: colors.dark },
  selectedFieldDim: { opacity: 0.85 },
  modalItemRow: { flexDirection: 'row', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.white, borderRadius: 12, padding: 20, width: '85%', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: colors.primary },
  modalItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: colors.light },
  selectedModalItem: { backgroundColor: '#e3f2fd' },
  closeModalBtn: { marginTop: 16, alignSelf: 'center', padding: 10 },
  closeModalText: { color: colors.primary, fontWeight: 'bold', fontSize: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: colors.primary },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  emptyText: { color: colors.grey, fontStyle: 'italic', marginBottom: 8 },
  cardList: { marginBottom: 16 },
  card: { backgroundColor: colors.white, padding: 16, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: colors.grey },
  selectedCard: { borderColor: colors.primary, backgroundColor: '#e3f2fd' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  cardSub: { color: colors.grey, fontSize: 14 },
  selectedLabel: { color: colors.primary, fontWeight: 'bold', fontSize: 22, marginLeft: 8 },
  item: { backgroundColor: colors.white, padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: colors.grey },
  selectedItem: { borderColor: colors.primary, backgroundColor: '#e3f2fd' },
  estimate: { marginTop: 20, fontSize: 16, color: colors.secondary, textAlign: 'center' },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: colors.white, fontWeight: 'bold', fontSize: 18 },
});

export default CheckoutScreen;
