import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../config/colors';

const PaymentMethodsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => navigation.navigate('MobileWallets')}
      >
        <Text style={styles.methodTitle}>Mobile Wallets</Text>
        <Text style={styles.methodDesc}>Add and manage your mobile money wallets</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => navigation.navigate('BankWallets')}
      >
        <Text style={styles.methodTitle}>Bank Wallets</Text>
        <Text style={styles.methodDesc}>Link your bank accounts (coming soon)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.methodCard}
        onPress={() => navigation.navigate('DebitCards')}
      >
        <Text style={styles.methodTitle}>Debit Cards</Text>
        <Text style={styles.methodDesc}>Add your debit cards (coming soon)</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 24,
    marginTop: 12,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  methodDesc: {
    color: '#666',
    fontSize: 14,
  },
});

export default PaymentMethodsScreen;
