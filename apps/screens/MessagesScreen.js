import React from 'react';
import { FlatList, StyleSheet,View } from 'react-native';
import  Constants  from 'expo-constants';


import ListItem from '../components/ListItem';
import Screen from './Screen';
import screenRoute from '../navigation/route';
import ReviewListItem from '../components/ReviewListItem';
import ListItemSeparator from '../components/ListItemSeparator';
import NewListingButton from '../components/NewListingButton';
import colors from '../config/colors';

function MessagesScreen({navigation,route}) {

    
    
    const values = route.params;
    const reviews = values['reviews']
    
    const item_id = values['item_id'] ? values['item_id'] :null;


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
            onPress={()=> navigation.navigate(screenRoute.REVIEW_DETAILS, item)} 
            showChevrons
        />)}

        ItemSeparatorComponent={ ListItemSeparator }
        />
        <View style={styles.addComment}>
            <NewListingButton style={styles.button} onPress={()=>navigation.navigate(screenRoute.NEW_COMMENT,item_id)}/>
        </View>

        </Screen>
        
       
        
    );
}


const styles = StyleSheet.create({
    container:{
        paddingTop: Constants.statusBarHeight
    },
    addComment:{ 
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        justifyContent: 'flex-end',

    },
    button:{
        height:50,
        width: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        borderColor: colors.white,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    }
})




export default MessagesScreen;