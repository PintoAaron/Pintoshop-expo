import React from 'react';
import { StyleSheet,View,Text, TouchableOpacity } from 'react-native';

import { Image } from 'react-native-expo-image-cache';

import AppText from '../components/AppText';
import colors from '../config/colors';
import listingsApi from '../api/listings';
import Screenroute from '../navigation/route';

function UserHistoryItemDetails({navigation, route }) {
    const listing = route.params

    const handleCancel = () => {
        listingsApi.deleteRequest(listing.id);

        navigation.navigate(Screenroute.MESSAGES)

    }
    
    return (
        <View>
             <Image style={styles.image} uri={ listing.task.image_url}/>
             <View style={styles.detailscontainer}>
                <View style={{flexDirection:'row'}}>
                    <View style={{flex:1}}>
                    <AppText style={styles.title}>{listing.task.title}</AppText>
                    </View>
                <AppText style={styles.price}>Ghc {listing.task.price}</AppText>
                </View>
                <Text style={styles.description}>{listing.task.description}</Text>

            

            {
                listing.status === "PENDING" ?
               
                <TouchableOpacity onPress={() => handleCancel()}>

                <View style={styles.statusButton}>
                    <Text style={{padding: 13,color:colors.white}}>CANCEL REQUEST</Text>
                </View> 
                </TouchableOpacity> :
                null

            }
            </View>
        </View>
        
    );
}

export default UserHistoryItemDetails;

const styles = StyleSheet.create({
    image:{
        width: '100%',
        height:'60%',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
   

    },
    detailscontainer:{
        padding: 10
        
    },
    title: {
        marginBottom:15,
        color: colors.black,
        fontWeight: 'bold'
    },
    price:{
        color:colors.primary,
        fontWeight: 'bold',
    },
    description:{
        fontWeight: '300',
        color: colors.grey,
        textAlign:'left',
        marginBottom: 10

    },
    itemcontainer: {
        marginVertical: 40
    },
    contact:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        gap: 10
        
    },
    phone:{
        fontSize: 15,
        fontWeight: '500',
    
    },
    statusButton:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.blue,
        borderRadius: 15,
        width: '50%',
       
    },


    
})