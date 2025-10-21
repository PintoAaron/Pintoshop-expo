import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator } from 'react-native';
import mobileWalletsApi from '../api/mobileWallets';
import shopApi from '../api/shop';
import colors from '../config/colors';

const SERVICE_PROVIDERS = ['MTN', 'TELECEL', 'AIRTEL'];

const MobileWalletsScreen = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', service_provider: SERVICE_PROVIDERS[0], phone_number: '' });
  const [verifyingId, setVerifyingId] = useState(null);
  const [otp, setOtp] = useState('');
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const customerRes = await shopApi.getCustomerMe();
      if (!customerRes.ok || !customerRes.data?.id) {
        Alert.alert('Error', 'Unable to get customer info.');
        setLoading(false);
        return;
      }
      setCustomerId(customerRes.data.id);
      const res = await mobileWalletsApi.getMobileWallets(customerRes.data.id);
      if (res.ok) setWallets(res.data);
      else Alert.alert('Error', 'Unable to fetch wallets.');
    } catch (e) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWallet = async () => {
    if (!form.title || !form.phone_number) {
      Alert.alert('Validation', 'All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await mobileWalletsApi.addMobileWallet(customerId, form);
      if (res.ok) {
        setShowAdd(false);
        setForm({ title: '', service_provider: SERVICE_PROVIDERS[0], phone_number: '' });
        fetchWallets();
      } else {
        Alert.alert('Error', 'Failed to add wallet.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to add wallet.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (walletId) => {
    setVerifyingId(walletId);
    try {
      const res = await mobileWalletsApi.sendWalletOtp(customerId, walletId);
      if (res.ok) {
        Alert.alert('OTP Sent', 'An OTP has been sent to your phone.');
      } else {
        Alert.alert('Error', 'Failed to send OTP.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (walletId) => {
    if (!otp) {
      Alert.alert('Validation', 'Please enter the OTP.');
      return;
    }
    setLoading(true);
    try {
      const res = await mobileWalletsApi.verifyWalletOtp(customerId, walletId, otp);
      if (res.ok) {
        setOtp('');
        setVerifyingId(null);
        fetchWallets();
        Alert.alert('Success', 'Wallet verified!');
      } else {
        Alert.alert('Error', 'Failed to verify OTP.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  const renderWallet = ({ item }) => (
    <View style={styles.walletCard}>
      <Text style={styles.walletTitle}>{item.title}</Text>
      <Text style={styles.walletProvider}>{item.service_provider}</Text>
      <Text style={styles.walletNumber}>{item.phone_number}</Text>
      <Text style={item.verified ? styles.verified : styles.notVerified}>
        {item.verified ? 'Verified' : 'Not Verified'}
      </Text>
      {!item.verified && (
        <View style={styles.otpRow}>
          <TouchableOpacity style={styles.otpBtn} onPress={() => handleSendOtp(item.id)}>
            <Text style={styles.otpBtnText}>Send OTP</Text>
          </TouchableOpacity>
          {verifyingId === item.id && (
            <View style={styles.otpInputRow}>
              <TextInput
                style={styles.otpInput}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity style={styles.otpBtn} onPress={() => handleVerifyOtp(item.id)}>
                <Text style={styles.otpBtnText}>Verify</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mobile Wallets</Text>
      <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
        <Text style={styles.addBtnText}>+ Add Wallet</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={wallets}
          keyExtractor={item => item.id.toString()}
          renderItem={renderWallet}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Mobile Wallet</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={form.title}
              onChangeText={v => setForm({ ...form, title: v })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={form.phone_number}
              onChangeText={v => setForm({ ...form, phone_number: v })}
              keyboardType="phone-pad"
            />
            <View style={styles.providerRow}>
              {SERVICE_PROVIDERS.map(sp => (
                <TouchableOpacity
                  key={sp}
                  style={[
                    styles.providerBtn,
                    form.service_provider === sp && styles.providerBtnActive,
                  ]}
                  onPress={() => setForm({ ...form, service_provider: sp })}
                >
                  <Text
                    style={[
                      styles.providerBtnText,
                      form.service_provider === sp && styles.providerBtnTextActive,
                    ]}
                  >
                    {sp}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddWallet}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 18,
    marginTop: 10,
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 18,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  walletCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  walletTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  walletProvider: {
    color: '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  walletNumber: {
    color: '#222',
    fontSize: 15,
    marginBottom: 2,
  },
  verified: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  notVerified: {
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  otpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  otpBtn: {
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginRight: 8,
  },
  otpBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  otpInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 6,
    width: 80,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  providerRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'center',
  },
  providerBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    backgroundColor: '#fff',
  },
  providerBtnActive: {
    backgroundColor: colors.primary,
  },
  providerBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  providerBtnTextActive: {
    color: '#fff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MobileWalletsScreen;
