import React,{ useState} from 'react';
import { FlatList, StyleSheet,View } from 'react-native';
import  Constants  from 'expo-constants';


import ListItem from '../components/ListItem';
import Screen from './Screen';
import screenRoute from '../navigation/route';

import ListItemSeparator from '../components/ListItemSeparator';
import ReviewListItem from '../components/ReviewListItem';

function UserMessagesScreen({navigation,route}) {

    
    
    const values = route.params;
    const reviews = values['reviews']
    

    return (
        <Screen>
        
        <FlatList  
        data={reviews}
        keyExtractor={review => review.id.toString()}
        renderItem={({ item }) =>
         (<ReviewListItem
            image={require('../assets/profile.jpg')}
            title={item.user.username} 
            subtitle={item.user.email} 
            message={item.message}
            onPress={()=> navigation.navigate(screenRoute.CURRENT_USER_REVIEW_DATAILS, item)} 
            showChevrons
        />)}

        ItemSeparatorComponent={ ListItemSeparator }
        />
        </Screen>
        
       
        
    );
}


const styles = StyleSheet.create({
    container:{
        paddingTop: Constants.statusBarHeight
    },
 
})




export default UserMessagesScreen;