import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';


import ListingScreen from '../screens/ListingScreen';
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import UserHistoryScreen from '../screens/UserHistoryScreen';
import UserHistoryItemDetails from '../screens/UserHistoryItemDetails';
import MessagesScreen from '../screens/MessagesScreen';
import ReviewDetailsScreen from '../screens/ReviewDetailsScreen';
import NewCommentScreen from '../screens/NewCommentScreen';
import NewReplyScreen from '../screens/NewReplyScreen';
import colors from '../config/colors';

const Stack = createNativeStackNavigator();




const FeedNavigator = () => (
    <Stack.Navigator mode="modal" screenOptions={{headerShown:false}}>
        <Stack.Screen name='Listings' component={ListingScreen}/>
        <Stack.Screen name='ListingDetails' component={ListingDetailsScreen} />
        <Stack.Screen name='UserHistoryItemDetails' component={UserHistoryItemDetails}/>
        <Stack.Screen name='UserHistory' component={UserHistoryScreen}
        options={{
            headerStyle: {backgroundColor:colors.primary},
            headerTintColor: "white",
            headerShown: true,
            title: 'User Listings',
            
        }}/>
        <Stack.Screen name='Reviews' component={MessagesScreen} 
        options={{
            headerStyle: {backgroundColor:'#e5525f'},
            headerTintColor: "white",
            headerShown: true,
            title:' Item Reviews', }}/>
         <Stack.Screen name='ReviewDetails' component={ReviewDetailsScreen} 
        options={{
            headerStyle: {backgroundColor:'#e5525f'},
            headerTintColor: "white",
            headerShown: true,
            title:' Review Details', }}/>
        <Stack.Screen name='NewComment' component={NewCommentScreen} 
        options={{
            headerStyle: {backgroundColor:'#e5525f'},
            headerTintColor: "white",
            headerShown: true,
            title:' Add Comment', }}/>
        <Stack.Screen name='NewReply' component={NewReplyScreen} 
        options={{
            headerStyle: {backgroundColor:'#e5525f'},
            headerTintColor: "white",
            headerShown: true,
            title:' Reply Post', }}/>

    </Stack.Navigator>
);


export default FeedNavigator;

