import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from './Screen';
import colors from '../config/colors';
import screenRoute from '../navigation/route';
import useAuth from '../hooks/useAuth';
import shopApi from '../api/shop';

const { width } = Dimensions.get('window');

function AccountScreen({ navigation }) {
    const { user, logout } = useAuth();
    
    const [orders, setOrders] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        totalProducts: 0
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            
            // Load customer details (includes user info)
            const customerResponse = await shopApi.getCustomerMe();
            
            if (customerResponse.ok && customerResponse.data) {
                // Set user details from the customer response
                setUserDetails(customerResponse.data);
            }

            // Load orders
            const ordersResponse = await shopApi.getOrders();
            if (ordersResponse.ok) {
                const orderData = ordersResponse.data.results || ordersResponse.data || [];
                setOrders(orderData);
                
                // Calculate stats
                const totalOrders = orderData.length;
                const totalSpent = orderData.reduce((sum, order) => sum + (order.total || 0), 0);
                
                setStats({
                    totalOrders,
                    totalSpent,
                    totalProducts: 0 // We'll add this when we have product creation tracking
                });
            }
            
            // Load user's products (if they're a seller)
            const productsResponse = await shopApi.getUserProducts();
            if (productsResponse.ok) {
                const products = productsResponse.data.results || productsResponse.data || [];
                setStats(prev => ({
                    ...prev,
                    totalProducts: products.length
                }));
            }
        } catch (error) {
            console.log('Error loading user data:', error);
            // Set default stats on error
            setStats({
                totalOrders: 0,
                totalSpent: 0,
                totalProducts: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, onPress }) => (
        <TouchableOpacity style={[styles.statCard, { borderColor: color }]} onPress={onPress}>
            <View style={[styles.statIcon, { backgroundColor: color }]}>
                <MaterialCommunityIcons name={icon} size={24} color={colors.white} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </TouchableOpacity>
    );

    const ActionButton = ({ title, subtitle, icon, color, onPress, showBadge, badgeCount }) => (
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <View style={styles.actionButtonContent}>
                <View style={[styles.actionIcon, { backgroundColor: color }]}>
                    <MaterialCommunityIcons name={icon} size={28} color={colors.white} />
                    {showBadge && badgeCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badgeCount}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>{title}</Text>
                    <Text style={styles.actionSubtitle}>{subtitle}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.grey} />
            </View>
        </TouchableOpacity>
    );

    // Compose all sections into a header for FlatList
    const renderHeader = () => (
        <>
            {/* Header Profile Section */}
            <View style={styles.headerContainer}>
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <MaterialCommunityIcons name="account-circle" size={80} color={colors.primary} />
                        <TouchableOpacity style={styles.editProfileButton}>
                            <MaterialCommunityIcons name="pencil" size={16} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <View style={styles.userNameRow}>
                            <Text style={styles.userName}>{userDetails?.user?.username || user?.username || 'User'}</Text>
                            {userDetails?.membership && (
                                <View style={styles.membershipBadge}>
                                    <Text style={styles.membershipText}>{userDetails.membership}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.memberSince}>
                            Member since {userDetails?.user?.date_joined ? new Date(userDetails.user.date_joined).getFullYear() : '2024'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
                <Text style={styles.sectionTitle}>Your Activity</Text>
                <View style={styles.statsRow}>
                    <StatCard
                        title="Orders"
                        value={stats.totalOrders}
                        icon="shopping"
                        color={colors.primary}
                        onPress={() => navigation.navigate(screenRoute.CURRENT_USER_HISTORY, user)}
                    />
                    <StatCard
                        title="Spent"
                        value={`₵${stats.totalSpent.toFixed(2)}`}
                        icon="currency-usd"
                        color="#4CAF50"
                    />
                    <StatCard
                        title="Products"
                        value={stats.totalProducts}
                        icon="package-variant"
                        color="#FF9800"
                        onPress={() => navigation.navigate(screenRoute.LISTING_EDIT)}
                    />
                </View>
            </View>

            {/* Shopping Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Shopping</Text>
                <View style={styles.actionContainer}>
                    <ActionButton
                        title="My Orders"
                        subtitle="Track your purchases"
                        icon="package-variant-closed"
                        color={colors.primary}
                        onPress={() => navigation.navigate('Orders')}
                        showBadge={true}
                        badgeCount={stats.totalOrders}
                    />
                    <ActionButton
                        title="Wishlist"
                        subtitle="Saved items"
                        icon="heart-outline"
                        color="#E91E63"
                        onPress={() => navigation.navigate(screenRoute.FAVORITES)}
                    />
                    <ActionButton
                        title="Address Book"
                        subtitle="Manage delivery addresses"
                        icon="map-marker-outline"
                        color="#607D8B"
                        onPress={() => {/* Navigate to addresses */}}
                    />
                </View>
            </View>

            {/* Seller Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Selling</Text>
                <View style={styles.actionContainer}>
                    <ActionButton
                        title="My Products"
                        subtitle="Manage your listings"
                        icon="store"
                        color="#FF9800"
                        onPress={() => navigation.navigate(screenRoute.USER_PRODUCTS)}
                        showBadge={true}
                        badgeCount={stats.totalProducts}
                    />
                    <ActionButton
                        title="Add Product"
                        subtitle="List a new item"
                        icon="plus-circle"
                        color="#4CAF50"
                        onPress={() => navigation.navigate(screenRoute.LISTING_EDIT)}
                    />
                    <ActionButton
                        title="Sales Analytics"
                        subtitle="View your performance"
                        icon="chart-line"
                        color="#3F51B5"
                        onPress={() => {/* Navigate to analytics */}}
                    />
                </View>
            </View>

            {/* Account Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.actionContainer}>
                    <ActionButton
                        title="Profile Settings"
                        subtitle="Edit your information"
                        icon="account-edit"
                        color="#607D8B"
                        onPress={() => {/* Navigate to profile settings */}}
                    />
                    <ActionButton
                        title="Payment Methods"
                        subtitle="Cards and payment options"
                        icon="credit-card-outline"
                        color="#795548"
                        onPress={() => navigation.navigate(screenRoute.PAYMENT_METHODS)}
                    />
                    <ActionButton
                        title="Notifications"
                        subtitle="Manage alerts and updates"
                        icon="bell-outline"
                        color="#FF5722"
                        onPress={() => {/* Navigate to notifications */}}
                    />
                    <ActionButton
                        title="Help & Support"
                        subtitle="Get assistance"
                        icon="help-circle-outline"
                        color="#009688"
                        onPress={() => {/* Navigate to help */}}
                    />
                </View>
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <MaterialCommunityIcons name="logout" size={24} color={colors.white} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
        </>
    );

    return (
        <Screen style={styles.screen}>
            <FlatList
                data={[]}
                keyExtractor={() => 'dummy'}
                renderItem={null}
                ListHeaderComponent={renderHeader}
                showsVerticalScrollIndicator={false}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusBarHeight,
        backgroundColor: colors.light,
        flex: 1,
    },
    headerContainer: {
        backgroundColor: colors.white,
        paddingBottom: 20,
        marginBottom: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    profileImageContainer: {
        position: 'relative',
        marginRight: 15,
    },
    editProfileButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    profileInfo: {
        flex: 1,
    },
    userNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginRight: 10,
    },
    membershipBadge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    membershipText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    memberSince: {
        fontSize: 14,
        color: colors.grey,
        fontStyle: 'italic',
    },
    statsContainer: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 15,
        marginLeft: 5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        width: (width - 60) / 3,
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIcon: {
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 12,
        color: colors.grey,
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionContainer: {
        backgroundColor: colors.white,
        borderRadius: 15,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButton: {
        borderBottomWidth: 1,
        borderBottomColor: colors.light,
    },
    actionButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    actionIcon: {
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF5722',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    badgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 14,
        color: colors.grey,
    },
    logoutSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#FF5722',
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    logoutText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    bottomSpacing: {
        height: 30,
    },
});

export default AccountScreen;

