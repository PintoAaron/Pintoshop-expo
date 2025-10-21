import React from 'react';
import { StyleSheet,View,TouchableWithoutFeedback,Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-expo-image-cache';



import colors from '../config/colors';
import AppText from './AppText';

function RequestCard({title,subtitle,imageUrl,onPress,requestStatus}) {
    return (
        <TouchableOpacity onPress={onPress}>

        <View style={styles.card}>
            <Image style={styles.image} uri={imageUrl}/>
            <View style={styles.detailscontainer}>
              <View style = {{flexDirection:'row'}}>
                <View style={{flex: 1}}>

                   <AppText style={styles.title} >{title}</AppText>
                </View>
              
              <AppText style={styles.subtitle}>Ghc {subtitle}</AppText>
              </View>
                { 
                requestStatus === 'PENDING' ?
                <View style={styles.statusButton}>
                  <Text style={styles.text}>REQUEST {requestStatus}</Text>
                </View>
                   :
                <View style ={[styles.statusButton,{ backgroundColor: colors.green}]}>
                <Text style={[styles.text]}>REQUEST {requestStatus}</Text>
                </View>
                }
            </View>

        </View>
        </TouchableOpacity>
        
        
    );
}

export default RequestCard;

const styles = StyleSheet.create({
    card:{
        backgroundColor: colors.white,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 10
    },
    image:{
        width:'100%',
        height: 150,
    },
    detailscontainer:{
        padding: 10
    },
    title:{
        marginBottom:12
    },
    subtitle:{
        color: colors.primary,
        fontWeight: 'bold',

    },
    postTime:{
        paddingRight: 5,
        fontSize: 12,
        color: colors.grey
    },
    statusButton:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.blue,
        borderRadius: 15,
       
    },
    text:{
        padding: 13,
        color: colors.white,
        fontWeight: '500'
    }

})