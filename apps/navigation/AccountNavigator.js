import FavoritesScreen from '../screens/FavoritesScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import MobileWalletsScreen from '../screens/MobileWalletsScreen';
import ComingSoonScreen from '../screens/ComingSoonScreen';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountScreen from '../screens/AccountScreen';
import ListingEditScreen from '../screens/ListingEditScreen';
import MessagesScreen from '../screens/MessagesScreen';
import UserHistoryScreen from '../screens/UserHistoryScreen';
import UserHistoryItemDetails from '../screens/UserHistoryItemDetails';
import ReviewDetailsScreen from '../screens/ReviewDetailsScreen';
import UserMessagesScreen from '../screens/UserMessagesScreen';
import CurrentUserHistoryScreen from '../screens/CurrentUserHistoryScreen';
import UserTaskDetails from '../screens/UserTaskDetails';
import CurrentUserReviewScreen from '../screens/CurrentUserReviewScreen';
import CurrentUserReviewDetailsScreen from '../screens/CurrentUserReviewDetailsScreen';
import UserProductsScreen from '../screens/UserProductsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import colors from '../config/colors';





const Stack = createNativeStackNavigator();


const AccountNavigator = () => {
    return (
        <Stack.Navigator mode="modal" screenOptions={{headerShown:false}} initialRouteName="Account">
            <Stack.Screen name='Favorites' component={FavoritesScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'Wishlist',
                }}
            />
            <Stack.Screen name='Account' component={AccountScreen}/>
            <Stack.Screen name='ListingEdit' component={ListingEditScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'Add Product',
                }}
            />
            <Stack.Screen name='UserHistoryItemDetails' component={UserHistoryItemDetails}/>
            <Stack.Screen name = 'UserTaskDetails' component={UserTaskDetails} />
            <Stack.Screen name='CurrentUserHistory' component={CurrentUserHistoryScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'My Listings',
                }}
            />
            <Stack.Screen name='Reviews' component={UserMessagesScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:' My Errands',
                }}
            />
            <Stack.Screen name='ReviewDetails' component={ReviewDetailsScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:' Review Details',
                }}
            />
            <Stack.Screen name='CurrentUserReview' component={CurrentUserReviewScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:' My Reviews',
                }}
            />
            <Stack.Screen name='CurrentUserReviewDetails' component={CurrentUserReviewDetailsScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:' Review Details',
                }}
            />
            <Stack.Screen name='UserProducts' component={UserProductsScreen} />
            <Stack.Screen name='PaymentMethods' component={PaymentMethodsScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'Payment Methods',
                }}
            />
            <Stack.Screen name='MobileWallets' component={MobileWalletsScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'Mobile Wallets',
                }}
            />
            <Stack.Screen name='BankWallets' children={() => <ComingSoonScreen title="Bank Wallets" />} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'Bank Wallets',
                }}
            />
            <Stack.Screen name='DebitCards' children={() => <ComingSoonScreen title="Debit Cards" />} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'Debit Cards',
                }}
            />
            <Stack.Screen name='Orders' component={OrdersScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'My Orders',
                }}
            />
            <Stack.Screen name='OrderDetails' component={OrderDetailsScreen} 
                options={{
                    headerStyle: {backgroundColor:colors.primary},
                    headerTintColor: "white",
                    headerShown: true,
                    title:'Order Details',
                }}
            />
        </Stack.Navigator>
    );
};

export default AccountNavigator;

