import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, Dimensions, Alert } from 'react-native';
import { Image } from 'react-native-expo-image-cache';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import AppText from '../components/AppText';
import colors from '../config/colors';
import ListItem from '../components/ListItem';
import useCurrentUser from '../hooks/useCurrentUser';
import screenRoute from '../navigation/route';
import AppButtons from '../components/AppButtons';
import shopApi from '../api/shop';
import cartApi from '../api/cart';
import useAuth from '../hooks/useAuth';

const { width } = Dimensions.get('window');

// Helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
};

function ListingDetailsScreen({ navigation, route }) {
    const { user } = useAuth();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    
    const listing = route.params;
    
    // Safety checks for missing data
    if (!listing) {
        return (
            <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
                <MaterialCommunityIcons name="alert-circle" size={64} color={colors.grey} />
                <Text style={{ fontSize: 16, color: colors.grey, marginTop: 16 }}>Product not found</Text>
            </View>
        );
    }
    
    // Remove user-related functionality since this is now a product catalog
    const images = listing.images || [];

    // Load cart item count on component mount
    React.useEffect(() => {
        loadCartItemCount();
        loadRelatedProducts();
    }, []);

    const loadCartItemCount = async () => {
        try {
            const cart = await shopApi.getUserCart();
            if (cart) {
                const itemsResponse = await shopApi.getCartItems(cart.id);
                if (itemsResponse.ok) {
                    const totalItems = itemsResponse.data.reduce((sum, item) => sum + item.quantity, 0);
                    setCartItemCount(totalItems);
                }
            }
        } catch (error) {
            console.log('Error loading cart count:', error);
        }
    };

    const loadRelatedProducts = async () => {
        try {
            const response = await shopApi.getProducts();
            if (response.ok) {
                // Filter out current product and get products from same collection or random products
                const filtered = response.data.results.filter(p => p.id !== listing.id);
                const sameCollection = filtered.filter(p => p.collection?.id === listing.collection?.id);
                const related = sameCollection.length >= 3 ? sameCollection.slice(0, 4) : filtered.slice(0, 4);
                setRelatedProducts(related);
            }
        } catch (error) {
            console.log('Error loading related products:', error);
        }
    };

    const handleAddToCart = async () => {
        setIsAddingToCart(true);
        try {
            // 1. Get customer id
            const customerRes = await shopApi.getCustomerMe();
            if (!customerRes.ok || !customerRes.data?.id) {
                Alert.alert('Error', 'Unable to get customer info. Please try again.');
                setIsAddingToCart(false);
                return;
            }
            const customerId = customerRes.data.id;

            // 2. Get or create cart for customer
            const cartRes = await cartApi.getOrCreateCart(customerId);
            if (!cartRes.ok || !cartRes.data?.id) {
                Alert.alert('Error', 'Unable to access cart. Please try again.');
                setIsAddingToCart(false);
                return;
            }
            const cartId = cartRes.data.id;

            // 3. Add item to cart
            const addRes = await cartApi.addItemToCart(cartId, listing.id, quantity);
            if (addRes.ok) {
                Alert.alert(
                    'Success!',
                    `${quantity} ${listing.title}${quantity > 1 ? 's' : ''} added to cart`,
                    [
                        { text: 'Continue Shopping', style: 'default' },
                        {
                            text: 'View Cart',
                            style: 'default',
                            onPress: () => {
                                navigation.navigate('Cart');
                            }
                        }
                    ]
                );
                setQuantity(1);
                loadCartItemCount();
            } else {
                Alert.alert('Error', 'Failed to add item to cart. Please try again.');
            }
        } catch (error) {
            console.log('Add to cart error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const increaseQuantity = () => {
        if (quantity < (listing.inventory || 0)) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleBuyNow = async () => {
        // TODO: Implement direct purchase functionality
        Alert.alert(
            'Buy Now', 
            `Proceed to checkout with ${quantity} ${listing.title}${quantity > 1 ? 's' : ''}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Checkout', 
                    style: 'default', 
                    onPress: () => {
                        console.log('Navigate to checkout');
                        // TODO: Navigate to checkout screen
                    }
                }
            ]
        );
    };

    const renderThumbnail = ({ item, index }) => (
        <TouchableOpacity
            style={[
                styles.thumbnailContainer,
                selectedImageIndex === index && styles.selectedThumbnail
            ]}
            onPress={() => setSelectedImageIndex(index)}
        >
            <Image
                style={styles.thumbnail}
                uri={item.image_url}
            />
            {selectedImageIndex === index && (
                <View style={styles.selectedOverlay}>
                    <MaterialCommunityIcons name="check-circle" size={20} color={colors.primary} />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.screen}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Details</Text>
                <TouchableOpacity 
                    style={styles.cartButton} 
                    onPress={() => {
                        // TODO: Navigate to cart screen
                        console.log('Navigate to cart screen');
                    }}
                >
                    <MaterialCommunityIcons name="cart" size={24} color={colors.dark} />
                    {cartItemCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Main Image Display */}
            <View style={styles.imageContainer}>
                {images.length > 0 ? (
                    <Image
                        style={styles.image}
                        uri={images[selectedImageIndex]?.image_url}
                    />
                ) : (
                    <View style={[styles.image, styles.noImageContainer]}>
                        <MaterialCommunityIcons name="image-off" size={64} color={colors.grey} />
                        <Text style={styles.noImageText}>No image available</Text>
                    </View>
                )}
                {images.length > 1 && (
                    <View style={styles.imageCounter}>
                        <Text style={styles.counterText}>
                            {selectedImageIndex + 1} / {images.length}
                        </Text>
                    </View>
                )}
                {/* Stock Badge */}
                <View style={styles.stockBadge}>
                    <MaterialCommunityIcons 
                        name="package-variant" 
                        size={16} 
                        color={(listing.inventory || 0) > 0 ? colors.primary : colors.danger} 
                    />
                    <Text style={[styles.stockText, { color: (listing.inventory || 0) > 0 ? colors.primary : colors.danger }]}>
                        {(listing.inventory || 0) > 0 ? `${listing.inventory || 0} in stock` : 'Out of stock'}
                    </Text>
                </View>
            </View>

            {/* Image Thumbnails */}
            {images.length > 1 && (
                <View style={styles.thumbnailSection}>
                    <Text style={styles.thumbnailTitle}>Images ({images.length})</Text>
                    <FlatList
                        data={images}
                        renderItem={renderThumbnail}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailList}
                    />
                </View>
            )}

            <View style={styles.detailscontainer}>
                <View style={styles.headerRow}>
                    <View style={{ flex: 1 }}>
                        <AppText style={styles.title}>{listing.title}</AppText>
                        {listing.collection && (
                            <View style={styles.categoryChip}>
                                <Text style={styles.categoryText}>{listing.collection.title}</Text>
                            </View>
                        )}
                    </View>
                    <AppText style={styles.price}>Ghc {(listing.unit_price || 0).toFixed(2)}</AppText>
                </View>
                
                {/* Product Description */}
                {listing.description && (
                    <View style={styles.descriptionSection}>
                        <Text style={styles.descriptionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>{listing.description}</Text>
                    </View>
                )}
                
                {/* Product Info Cards */}
                <View style={styles.infoCards}>
                    <View style={styles.infoCard}>
                        <MaterialCommunityIcons name="tag" size={20} color={colors.primary} />
                        <Text style={styles.infoCardText}>ID: #{listing.id}</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <MaterialCommunityIcons name="package-variant" size={20} color={colors.primary} />
                        <Text style={styles.infoCardText}>{listing.inventory || 0} available</Text>
                    </View>
                    {listing.last_update && (
                        <View style={styles.infoCard}>
                            <MaterialCommunityIcons name="clock-outline" size={20} color={colors.primary} />
                            <Text style={styles.infoCardText}>Updated {formatDate(listing.last_update)}</Text>
                        </View>
                    )}
                </View>

                {/* Quantity Selector */}
                {(listing.inventory || 0) > 0 && (
                    <View style={styles.quantitySection}>
                        <View>
                            <Text style={styles.quantityLabel}>Quantity:</Text>
                            <Text style={styles.totalPrice}>Total: Ghc {((listing.unit_price || 0) * quantity).toFixed(2)}</Text>
                        </View>
                        <View style={styles.quantitySelector}>
                            <TouchableOpacity 
                                style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
                                onPress={decreaseQuantity}
                                disabled={quantity <= 1}
                            >
                                <MaterialCommunityIcons name="minus" size={18} color={quantity <= 1 ? colors.grey : colors.dark} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity 
                                style={[styles.quantityButton, quantity >= (listing.inventory || 0) && styles.quantityButtonDisabled]}
                                onPress={increaseQuantity}
                                disabled={quantity >= (listing.inventory || 0)}
                            >
                                <MaterialCommunityIcons name="plus" size={18} color={quantity >= (listing.inventory || 0) ? colors.grey : colors.dark} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <View style={styles.buttonRow}>
                            {/* Removed duplicate Add to Cart button */}
                            <AppButtons 
                                title={isAddingToCart ? "Adding..." : "Add to Cart"}
                                onPress={handleAddToCart}
                                color="secondary"
                                style={[
                                    styles.addToCartButton, 
                                    styles.halfButton,
                                    ((listing.inventory || 0) === 0 || isAddingToCart) && styles.disabledButton
                                ]}
                                disabled={(listing.inventory || 0) === 0 || isAddingToCart}
                            />
                    </View>
                    {(listing.inventory || 0) === 0 && (
                        <Text style={styles.outOfStockText}>This item is currently out of stock</Text>
                    )}
                </View>
            </View>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <View style={styles.relatedSection}>
                    <Text style={styles.relatedTitle}>You might also like</Text>
                    <FlatList
                        data={relatedProducts}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.relatedProduct}
                                onPress={() => navigation.push('ListingDetails', item)}
                            >
                                {item.images && item.images.length > 0 ? (
                                    <Image
                                        style={styles.relatedImage}
                                        uri={item.images[0].image_url}
                                    />
                                ) : (
                                    <View style={[styles.relatedImage, styles.noImageContainer]}>
                                        <MaterialCommunityIcons name="image-off" size={32} color={colors.grey} />
                                    </View>
                                )}
                                <Text style={styles.relatedProductTitle} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <Text style={styles.relatedProductPrice}>
                                    Ghc {(item.unit_price || 0).toFixed(2)}
                                </Text>
                                {item.inventory !== undefined && (
                                    <Text style={styles.relatedProductStock}>
                                        {item.inventory > 0 ? `${item.inventory} left` : 'Out of stock'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.relatedList}
                    />
                </View>
            )}
            
            {/* Removed sticky Add to Cart button at the bottom */}
        </ScrollView>
    );
}
export default ListingDetailsScreen;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.light,
        flex: 1,
    },
    header: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: Constants.statusBarHeight + 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
    },
    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.light,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.dark,
    },
    shareButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.light,
    },
    cartButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: colors.light,
        position: 'relative',
    },
    cartBadge: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: colors.primary,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: width * 0.8, // Make it more square/modern
        backgroundColor: colors.light,
    },
    noImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImageText: {
        fontSize: 14,
        color: colors.grey,
        marginTop: 8,
    },
    imageCounter: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    stockBadge: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    stockText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    counterText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    thumbnailSection: {
        backgroundColor: colors.white,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
    },
    thumbnailTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    thumbnailList: {
        paddingHorizontal: 12,
    },
    thumbnailContainer: {
        marginHorizontal: 4,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    selectedThumbnail: {
        borderWidth: 2,
        borderColor: colors.primary,
    },
    selectedOverlay: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    detailscontainer: {
        backgroundColor: colors.white,
        padding: 16,
        marginTop: 8,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
        lineHeight: 24,
    },
    price: {
        fontSize: 18,
        color: colors.primary,
        fontWeight: 'bold',
    },
    categoryChip: {
        alignSelf: 'flex-start',
        backgroundColor: colors.light,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 8,
    },
    categoryText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },
    descriptionSection: {
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: colors.grey,
        lineHeight: 22,
    },
    infoCards: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
        flexWrap: 'wrap',
    },
    infoCard: {
        minWidth: '30%',
        flex: 1,
        backgroundColor: colors.light,
        borderRadius: 12,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoCardText: {
        fontSize: 13,
        color: colors.dark,
        fontWeight: '500',
        marginLeft: 8,
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.light,
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
    },
    totalPrice: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
        marginTop: 2,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.light,
        borderRadius: 8,
    },
    quantityButton: {
        backgroundColor: colors.white,
        borderRadius: 6,
        padding: 8,
        margin: 2,
    },
    quantityButtonDisabled: {
        backgroundColor: colors.light,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginHorizontal: 16,
        minWidth: 24,
        textAlign: 'center',
    },
    actionButtons: {
        marginTop: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    halfButton: {
        flex: 1,
    },
    addToCartButton: {
        paddingVertical: 16,
        borderRadius: 12,
    },
    buyNowButton: {
        paddingVertical: 16,
        borderRadius: 12,
    },
    outOfStockText: {
        textAlign: 'center',
        color: colors.danger,
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    relatedSection: {
        backgroundColor: colors.white,
        paddingVertical: 20,
        marginTop: 16,
    },
    relatedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    relatedList: {
        paddingHorizontal: 12,
    },
    relatedProduct: {
        width: 140,
        marginHorizontal: 4,
        backgroundColor: colors.light,
        borderRadius: 12,
        padding: 8,
    },
    relatedImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        backgroundColor: colors.grey,
        marginBottom: 8,
    },
    relatedProductTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.dark,
        marginBottom: 4,
        height: 36,
    },
    relatedProductPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
    },
    relatedProductStock: {
        fontSize: 12,
        color: colors.grey,
        marginTop: 2,
    },
    stickyBottom: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.light,
        marginTop: 16,
    },
    priceSection: {
        flex: 1,
        marginRight: 16,
    },
    stickyPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    stickyTotal: {
        fontSize: 14,
        color: colors.grey,
        marginTop: 2,
    },
    stickyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
    },
});