import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity, Text, TextInput, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from './Screen';
import Card from '../components/Card';
import favoritesApi from '../api/favorites';
import useAuth from '../hooks/useAuth';
import shopApi from '../api/shop';
import { Alert } from 'react-native';
import colors from '../config/colors';
import route from '../navigation/route';
import listingApi from '../api/listings';
import AppText from '../components/AppText';
import AppButtons from '../components/AppButtons';
import ActivityIndicator from '../components/ActivityIndicator';
import SkeletonLoader from '../components/SkeletonLoader';





function ListingScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState('date');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    loadListings();
    loadCategories();
    fetchCustomerIdAndFavorites();
  }, [user]);

  const fetchCustomerIdAndFavorites = async () => {
    try {
      const res = await shopApi.getCustomerMe();
      if (res.ok && res.data?.id) {
        setCustomerId(res.data.id);
        loadFavorites(res.data.id);
      }
    } catch (e) {}
  };

  const loadFavorites = async (cid = customerId) => {
    if (!cid) return;
    const response = await favoritesApi.getFavorites(cid);
    if (response.ok) setFavorites(response.data);
  };

  const loadListings = async () => {
    setLoading(true);
    const response = await listingApi.getListings();
    setLoading(false);
    if (!response.ok) return setError(true);
    setError(false);
    // Handle the new API structure with results array
    setListings(response.data.results || []);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    const response = await listingApi.getListings();
    setRefreshing(false);
    if (!response.ok) return setError(true);
    setError(false);
    setListings(response.data.results || []);
  };

  const loadCategories = async () => {
    const response = await listingApi.getCategories();
    if (response.ok) setCategories(response.data || []);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSortOption('date');
    setSearch('');
  };

  const getFilteredSortedListings = () => {
    let filtered = selectedCategory
      ? listings.filter((l) => l.collection?.id === selectedCategory.id)
      : listings;
    if (search.trim()) {
      filtered = filtered.filter((l) => 
        l.title.toLowerCase().includes(search.trim().toLowerCase()) ||
        (l.description && l.description.toLowerCase().includes(search.trim().toLowerCase()))
      );
    }
    if (sortOption === 'price') {
      filtered = [...filtered].sort((a, b) => a.unit_price - b.unit_price);
    } else if (sortOption === 'price_desc') {
      filtered = [...filtered].sort((a, b) => b.unit_price - a.unit_price);
    } else if (sortOption === 'inventory') {
      filtered = [...filtered].sort((a, b) => b.inventory - a.inventory);
    } else {
      // Sort by last_update if available, otherwise by id
      filtered = [...filtered].sort((a, b) => {
        if (a.last_update && b.last_update) {
          return new Date(b.last_update) - new Date(a.last_update);
        }
        return b.id - a.id;
      });
    }
    return filtered;
  };

  const filteredListings = getFilteredSortedListings();

  const handleAddFavorite = async (productId) => {
    if (!customerId) {
      Alert.alert('Login Required', 'Please log in to save favorites.');
      return;
    }
    const response = await favoritesApi.addFavorite(customerId, productId);
    if (response.ok) {
      loadFavorites(customerId);
      Alert.alert('Added to Favorites', 'Product has been added to your favorites.');
    } else {
      Alert.alert('Error', 'Could not add to favorites.');
    }
  };

  const isProductFavorite = (productId) => {
    return favorites.some(fav => fav.product && fav.product.id === productId);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.screen}>
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.headerTitle}>Find your perfect product</Text>
            </View>
            <TouchableOpacity style={styles.notificationIcon}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={colors.dark} />
            </TouchableOpacity>
          </View>

          {/* Enhanced Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <MaterialCommunityIcons name="magnify" size={20} color={colors.grey} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products, brands..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor={colors.grey}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
                  <MaterialCommunityIcons name="close-circle" size={18} color={colors.grey} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity 
              style={[styles.filterButton, showFilters && styles.filterButtonActive]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <MaterialCommunityIcons 
                name="tune-variant" 
                size={20} 
                color={showFilters ? colors.white : colors.dark} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Summary */}
        <View style={styles.resultsSummary}>
          <Text style={styles.resultsText}>
            {filteredListings.length} product{filteredListings.length !== 1 ? 's' : ''} found
          </Text>
          {(selectedCategory || search || sortOption !== 'date') && (
            <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Enhanced Filter/Sort Bar */}
        {showFilters && (
          <View style={styles.filterSortBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterChip, !selectedCategory && styles.selectedChip]}
                onPress={() => handleCategorySelect(null)}
              >
                <Text style={[styles.filterText, !selectedCategory && styles.selectedText]}>All</Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.filterChip, selectedCategory?.id === cat.id && styles.selectedChip]}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Text style={[styles.filterText, selectedCategory?.id === cat.id && styles.selectedText]}>
                    {cat.title} ({cat.product_count})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.sortBar}>
              <Text style={styles.sortLabel}>Sort by:</Text>
              <TouchableOpacity
                style={[styles.sortChip, sortOption === 'date' && styles.selectedChip]}
                onPress={() => handleSortChange('date')}
              >
                <MaterialCommunityIcons name="clock-outline" size={16} color={sortOption === 'date' ? colors.white : colors.dark} />
                <Text style={[styles.sortText, sortOption === 'date' && styles.selectedText]}>Newest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortOption === 'price' && styles.selectedChip]}
                onPress={() => handleSortChange('price')}
              >
                <MaterialCommunityIcons name="arrow-up" size={16} color={sortOption === 'price' ? colors.white : colors.dark} />
                <Text style={[styles.sortText, sortOption === 'price' && styles.selectedText]}>Low Price</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortOption === 'price_desc' && styles.selectedChip]}
                onPress={() => handleSortChange('price_desc')}
              >
                <MaterialCommunityIcons name="arrow-down" size={16} color={sortOption === 'price_desc' ? colors.white : colors.dark} />
                <Text style={[styles.sortText, sortOption === 'price_desc' && styles.selectedText]}>High Price</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortChip, sortOption === 'inventory' && styles.selectedChip]}
                onPress={() => handleSortChange('inventory')}
              >
                <MaterialCommunityIcons name="package-variant" size={16} color={sortOption === 'inventory' ? colors.white : colors.dark} />
                <Text style={[styles.sortText, sortOption === 'inventory' && styles.selectedText]}>Stock</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {loading ? (
          <SkeletonLoader count={5} />
        ) : (
          <>
            {error ? (
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
              >
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons name="wifi-off" size={64} color={colors.grey} />
                  <AppText style={styles.errorTitle}>Connection Error</AppText>
                  <AppText style={styles.errorText}>Couldn't retrieve posts from server</AppText>
                  <AppButtons title="Try Again" onPress={loadListings} color="primary" style={styles.retryButton} />
                </View>
              </ScrollView>
            ) : filteredListings.length === 0 ? (
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
              >
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons name="package-variant-closed" size={64} color={colors.grey} />
                  <AppText style={styles.emptyTitle}>No products found</AppText>
                  <AppText style={styles.emptyText}>Try adjusting your search or filters</AppText>
                </View>
              </ScrollView>
            ) : (
              <FlatList
                data={filteredListings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Card
                    title={item.title}
                    subtitle={'Ghc ' + item.unit_price.toFixed(2)}
                    imageUrl={item.images && item.images.length > 0 ? item.images[0].image_url : null}
                    postTime={null}
                    category={item.collection?.title}
                    rating={4}
                    isFavorite={isProductFavorite(item.id)}
                    inventory={item.inventory}
                    onPress={() => navigation.navigate(route.LISTING_DETAILS, item)}
                    onFavoritePress={() => handleAddFavorite(item.id)}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                  />
                }
              />
            )}
          </>
        )}

        {/* Enhanced Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('Add')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={28} color={colors.white} />
        </TouchableOpacity>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
    flex: 1,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 2,
  },
  notificationIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.dark,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    backgroundColor: colors.light,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  resultsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  resultsText: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '500',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.light,
  },
  clearFiltersText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  filterSortBar: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterChip: {
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.dark,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.white,
    fontWeight: '700',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortLabel: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '500',
    marginRight: 12,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  sortText: {
    fontSize: 12,
    color: colors.dark,
    fontWeight: '500',
    marginLeft: 4,
  },
  listContainer: {
    paddingTop: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
});

export default ListingScreen;


