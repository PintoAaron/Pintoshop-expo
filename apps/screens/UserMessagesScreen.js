import React, { useEffect, useState } from 'react';
import { StyleSheet,View,FlatList } from 'react-native';

import Screen from './Screen';
import colors from '../config/colors';
import screenRoute from '../navigation/route';
import listingApi from '../api/listings';
import shopApi from '../api/shop';
import AppText from '../components/AppText';
import AppButtons from '../components/AppButtons';
import ActivityIndicator from '../components/ActivityIndicator';
import RequestCard from '../components/RequestCard';



function UserMessagesScreen({ navigation,route }) {

const user = route.params;

const [listings,setListings] = useState([]);
const [error,setError] = useState(false);
const [loading,setLoading] = useState(false);
const [refreshing,setRefreshing] = useState(false);

useEffect(() =>{
    loadListings();

},[])



const loadListings = async () => {
    setLoading(true);
    const response = await shopApi.getOrders();
    setLoading(false);

    if (!response.ok)
        return setError(true);

    setError(false);
    setListings(response.data.results || response.data);

}





   return (


    <Screen style={styles.screen}>
            {error && <>
            <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
            <AppText>Couldn't retrieve user posts from server</AppText>
            <View style={{padding:10}}>
            <AppButtons title='Retry' onPress={loadListings} color='primary'/>
            </View>

            </View>
            </>}

            <ActivityIndicator visible ={loading} />
            

            <FlatList 
            data={listings}
            keyExtractor={listings => listings.id.toString() }
            renderItem={({item}) => 
                <RequestCard title={item.task.title} 
                 imageUrl= {item.task.image_url}
                 subtitle={item.task.price}
                 requestStatus={item.status}
                 onPress={()=>navigation.navigate(screenRoute.USER_HISTORY_ITEM_DETAILS,item)} 

                /> 
           
            }
            refreshing = {refreshing}
            onRefresh={ ()=> {loadListings();}}
            
            /> 

       


        </Screen>
       
    
   );
}


const styles = StyleSheet.create({
    screen:{
        backgroundColor:colors.light,
        padding:15,
        
    }


})


export default UserMessagesScreen;


