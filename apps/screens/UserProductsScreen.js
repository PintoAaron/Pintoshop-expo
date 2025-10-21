import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';

import Screen from './Screen';
import colors from '../config/colors';
import shopApi from '../api/shop';
import screenRoute from '../navigation/route';

function UserProductsScreen({ navigation }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadUserProducts();
    }, []);

    // Refresh products when screen comes into focus (after editing)
    useFocusEffect(
        React.useCallback(() => {
            loadUserProducts();
        }, [])
    );

    const loadUserProducts = async () => {
        try {
            setLoading(true);
            const response = await shopApi.getUserProducts();
            
            if (response.ok) {
                const productData = response.data.results || response.data || [];
                console.log('User products data:', JSON.stringify(productData, null, 2));
                setProducts(productData);
            } else {
                console.log('Failed to load user products:', response.problem);
                Alert.alert('Error', 'Failed to load your products. Please try again.');
            }
        } catch (error) {
            console.log('Error loading user products:', error);
            Alert.alert('Error', 'Failed to load your products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUserProducts();
        setRefreshing(false);
    };

    const handleProductPress = (product) => {
        navigation.navigate(screenRoute.LISTING_DETAILS, product);
    };

    const handleEditProduct = (product) => {
        navigation.navigate(screenRoute.LISTING_EDIT, product);
    };

    const handleDeleteProduct = (product) => {
        Alert.alert(
            'Delete Product',
            `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => deleteProduct(product.id)
                }
            ]
        );
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await shopApi.deleteProduct(productId);
            
            if (response.ok) {
                // Remove the product from local state
                setProducts(products.filter(p => p.id !== productId));
                Alert.alert('Success', 'Product deleted successfully');
            } else {
                Alert.alert('Error', 'Failed to delete product. Please try again.');
            }
        } catch (error) {
            console.log('Error deleting product:', error);
            Alert.alert('Error', 'Failed to delete product. Please try again.');
        }
    };

    const handleProductLongPress = (product) => {
        Alert.alert(
            'Product Options',
            `What would you like to do with "${product.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Edit', onPress: () => handleEditProduct(product) },
                { text: 'Delete', style: 'destructive', onPress: () => handleDeleteProduct(product) }
            ]
        );
    };

    const renderProductItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.productCard}
            onPress={() => handleProductPress(item)}
            onLongPress={() => handleProductLongPress(item)}
        >
            <View style={styles.productImageContainer}>
                {item.images && item.images.length > 0 ? (
                    <Image 
                        uri={item.images[0].image_url} 
                        style={styles.productImage} 
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <MaterialCommunityIcons name="package-variant" size={40} color={colors.grey} />
                    </View>
                )}
            </View>
            
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                    {item.title || item.name || 'Untitled Product'}
                </Text>
                <Text style={styles.productDescription} numberOfLines={2}>
                    {item.description || 'No description available'}
                </Text>
                <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>
                        ₵{item.price ? parseFloat(item.price).toFixed(2) : '0.00'}
                    </Text>
                    <View style={styles.stockContainer}>
                        <MaterialCommunityIcons 
                            name="package-variant" 
                            size={16} 
                            color={colors.grey} 
                        />
                        <Text style={styles.stockText}>
                            Stock: {item.inventory || item.stock || 'N/A'}
                        </Text>
                    </View>
                </View>
            </View>
            
            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => handleEditProduct(item)}
                >
                    <MaterialCommunityIcons name="pencil" size={18} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProduct(item)}
                >
                    <MaterialCommunityIcons name="delete" size={18} color="#FF5722" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="store" size={80} color={colors.grey} />
            <Text style={styles.emptyTitle}>No Products Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start selling by adding your first product
            </Text>
            <TouchableOpacity 
                style={styles.addFirstProductButton}
                onPress={() => navigation.navigate(screenRoute.LISTING_EDIT)}
            >
                <MaterialCommunityIcons name="plus" size={20} color={colors.white} />
                <Text style={styles.addFirstProductText}>Add Product</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Screen style={styles.screen}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Products</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate(screenRoute.LISTING_EDIT)}
                >
                    <MaterialCommunityIcons name="plus" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {loading && products.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <MaterialCommunityIcons name="loading" size={40} color={colors.primary} />
                    <Text style={styles.loadingText}>Loading your products...</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: colors.light,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    addButton: {
        padding: 5,
    },
    listContainer: {
        padding: 15,
        flexGrow: 1,
    },
    productCard: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImageContainer: {
        marginRight: 15,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: colors.light,
    },
    placeholderImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: colors.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productInfo: {
        flex: 1,
        marginRight: 10,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 5,
    },
    productDescription: {
        fontSize: 14,
        color: colors.grey,
        marginBottom: 10,
        lineHeight: 18,
    },
    productMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    stockContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockText: {
        fontSize: 12,
        color: colors.grey,
        marginLeft: 4,
    },
    editButton: {
        backgroundColor: colors.light,
        borderRadius: 18,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
        borderRadius: 18,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: colors.grey,
        marginTop: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        color: colors.grey,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    addFirstProductButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 25,
    },
    addFirstProductText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default UserProductsScreen;
