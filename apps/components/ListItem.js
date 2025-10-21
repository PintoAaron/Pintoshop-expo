import React from 'react';
import { StyleSheet,View,Image,Text, TouchableHighlight } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import  Swipeable from 'react-native-gesture-handler/Swipeable';


import AppText from './AppText';
import colors from '../config/colors';

function ListItem({image,title,subtitle,onPress,renderRightActions,IconComponent,showChevrons,style}) {

    return (
       <Swipeable renderRightActions={renderRightActions}>

          <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
            <View style={[styles.container,style]}>
            {IconComponent}    
            {image && <Image style={styles.imagestyle} source={image} />}
            <View style={styles.detailsContainer}>
              <AppText style={styles.title} numberOfLines = {1} >{title}</AppText>
              {subtitle && <AppText style={styles.subtitle} numberOfLines={2} >{subtitle}</AppText>}

            </View>
            <View>

            </View>
           

           { showChevrons &&  <MaterialCommunityIcons name='chevron-right' size={22} color={colors.grey}/> }



           </View>
         

        </TouchableHighlight>

        </Swipeable>
        
    );
}

export default ListItem;

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
        width:70,
        height:70,
        borderRadius: 35
    },

    title:{
        marginBottom:10,
        fontWeight: '600',
        fontSize: 18

    },
     
    subtitle: {
        color: colors.grey,
        fontSize: 14,
    },
    
})