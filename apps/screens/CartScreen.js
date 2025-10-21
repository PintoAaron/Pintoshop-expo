import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import cartApi from '../api/cart';
import shopApi from '../api/shop';
import colors from '../config/colors';

const CartScreen = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);


  // Always fetch cart when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadCart();
    }, [])
  );

  const loadCart = async () => {
    setLoading(true);
    try {
      // Get customer id
      const customerRes = await shopApi.getCustomerMe();
      if (!customerRes.ok || !customerRes.data?.id) {
        Alert.alert('Error', 'Unable to get customer info.');
        setLoading(false);
        return;
      }
      const customerId = customerRes.data.id;
      // Get or create cart
      const cartRes = await cartApi.getOrCreateCart(customerId);
      if (!cartRes.ok || !cartRes.data?.id) {
        Alert.alert('Error', 'Unable to fetch cart.');
        setLoading(false);
        return;
      }
      // Fetch cart details (with items)
      const cartId = cartRes.data.id;
      const cartDetailsRes = await cartApi.getCart(cartId);
      if (cartDetailsRes.ok) {
        setCart(cartDetailsRes.data);
      } else {
        Alert.alert('Error', 'Unable to fetch cart details.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setLoading(true);
      const res = await cartApi.updateCartItem(cart.id, item.id, newQuantity);
      if (res.ok) {
        loadCart();
      } else {
        Alert.alert('Error', 'Could not update quantity.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not update quantity.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      setLoading(true);
      const res = await cartApi.removeItemFromCart(cart.id, item.id);
      if (res.ok) {
        loadCart();
      } else {
        Alert.alert('Error', 'Could not remove item.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not remove item.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const images = item.product.images || [];
    const mainImage = images.length > 0 ? images[0].image_url : null;
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {mainImage ? (
            <Image source={{ uri: mainImage }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]} />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{item.product.title}</Text>
          <Text style={styles.price}>${item.product.unit_price}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Qty:</Text>
            <TouchableOpacity onPress={() => handleUpdateQuantity(item, item.quantity - 1)} style={styles.qtyBtn}>
              <MaterialCommunityIcons name="minus-circle-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.value}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleUpdateQuantity(item, item.quantity + 1)} style={styles.qtyBtn}>
              <MaterialCommunityIcons name="plus-circle-outline" size={22} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeBtn}>
              <MaterialCommunityIcons name="trash-can-outline" size={22} color={colors.danger || '#e74c3c'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.total}>Total: ${item.total_price}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="cart-outline" size={24} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={styles.headerText}>Shopping Cart</Text>
      </View>
      <FlatList
        data={cart.items}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${cart.total_price}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout', { cartId: cart.id, cartItems: cart.items })}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 0,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 20,
    marginTop: 18,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  qtyBtn: {
    marginHorizontal: 6,
    padding: 2,
  },
  removeBtn: {
    marginLeft: 10,
    padding: 2,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#ccc',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#222',
  },
  price: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    color: '#888',
    fontSize: 14,
    marginRight: 4,
  },
  value: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  total: {
    fontWeight: 'bold',
    color: colors.secondary,
    fontSize: 15,
    marginTop: 4,
  },
  totalContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.primary,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
});

export default CartScreen;
