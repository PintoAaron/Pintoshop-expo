import React from 'react';
import { StyleSheet,View,Image,Text, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'


import AppText from './AppText';
import colors from '../config/colors';

function ListItemWithRating({image,title,subtitle, email,onPress,IconComponent,style}) {
  
    return (

          <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
            <View style={[styles.container,style]}>
            {IconComponent}    
            {image && <Image style={styles.imagestyle} source={image} />}
            <View style={styles.detailsContainer}>
              <AppText style={styles.title} >{title}</AppText>
              <Text style={{fontSize: 13, color:colors.grey}}>{email}</Text>
              {subtitle && <AppText style={styles.subtitle}>{subtitle}</AppText>}
              <View style={{flexDirection:'row'}}>
               <MaterialCommunityIcons name='star' size={18} color={colors.gold} />
               <MaterialCommunityIcons name='star' size={18} color={colors.gold} />
               <MaterialCommunityIcons name='star' size={18} color={colors.light} />
               <MaterialCommunityIcons name='star' size={18} color={colors.light} />
               <MaterialCommunityIcons name='star' size={18} color={colors.light} />

              </View>

            </View>
            <View>

            </View>

           </View>
         

        </TouchableHighlight>

        
    );
}

export default ListItemWithRating;

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        backgroundColor:colors.white,
        borderRadius: 10,
       
    },

    detailsContainer:{

        marginLeft: 10,
        justifyContent: 'center',
        flex:1
    },

    imagestyle:{
        width:80,
        height:80,
        borderRadius: 40
    },

    title:{
    
        fontWeight: '700',
        fontSize: 18

    },
     
    subtitle: {
        color: colors.grey,
        fontSize: 13,
    },
    
})