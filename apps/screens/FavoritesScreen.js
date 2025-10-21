import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import Screen from './Screen';
import Card from '../components/Card';
import AppText from '../components/AppText';
import ActivityIndicator from '../components/ActivityIndicator';
import colors from '../config/colors';
import favoritesApi from '../api/favorites';
import useAuth from '../hooks/useAuth';
import shopApi from '../api/shop';
import { useFocusEffect } from '@react-navigation/native';

const FavoritesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [customerId, setCustomerId] = useState(null);


  useFocusEffect(
    useCallback(() => {
      fetchCustomerIdAndFavorites();
    }, [user])
  );

  const fetchCustomerIdAndFavorites = async () => {
    try {
      const res = await shopApi.getCustomerMe();
      if (res.ok && res.data?.id) {
        setCustomerId(res.data.id);
        loadFavorites(res.data.id);
      }
    } catch (e) {}
  };

  const loadFavorites = async (cid = customerId, showLoading = true) => {
    if (!cid) return;
    if (showLoading) setLoading(true);
    const response = await favoritesApi.getFavorites(cid);
    if (showLoading) setLoading(false);
    if (response.ok) setFavorites(response.data);
    else Alert.alert('Error', 'Could not load favorites.');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites(customerId, false);
    setRefreshing(false);
  };

  return (
    <Screen style={styles.screen}>
      <ActivityIndicator visible={loading} />
      {favorites.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>No favorite products yet.</AppText>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              title={item.product.title}
              subtitle={'Ghc ' + item.product.unit_price.toFixed(2)}
              imageUrl={item.product.images && item.product.images.length > 0 ? item.product.images[0].image_url : null}
              postTime={null}
              category={null}
              rating={4}
              isFavorite={true}
              inventory={null}
              onPress={() => navigation.navigate('ListingDetails', item.product)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: colors.grey,
    fontSize: 18,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default FavoritesScreen;
