import React from 'react';
import { StyleSheet,View,Image,Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import  Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment';

import AppText from './AppText';
import colors from '../config/colors';

function ReviewListItem({image,title,subtitle,onPress,renderRightActions,IconComponent,showChevrons,message,style,showDate}) {

    return (

       <Swipeable renderRightActions={renderRightActions}>

           <TouchableOpacity onPress={onPress}>
        <View>

            <View style={[styles.container,style]}>
            {IconComponent}    
            {image && <Image style={styles.imagestyle} source={image} />}
            <View style={styles.detailsContainer}>
              <AppText style={styles.title} >{title}</AppText>
              {subtitle && <AppText style={styles.subtitle} >{subtitle}</AppText>}

            </View>
           
           { showChevrons &&  <MaterialCommunityIcons name='chevron-right' size={22} color={colors.grey}/> }

           </View>
           <View style={{paddingLeft: 60}}>
            <Text style={styles.message}>{message}</Text>
           {showDate &&
             <View style={{flexDirection:'row'}}>
              <Text style={styles.postTime}>{moment(showDate).format('dddd')}</Text>
              <Text style={styles.postTime}>@{moment(showDate).format('HH:mm a')}</Text>     
        </View>}
           </View>
           

        </View>
        </TouchableOpacity>

        </Swipeable>
        
        
    );
}

export default ReviewListItem;

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
        width:40,
        height:40,
        borderRadius: 20
    },

    title:{
        
        fontWeight: '700',
        fontSize: 15

    },
     
    subtitle: {
        color: colors.grey,
        fontSize: 13,
    },
    message:{
        color: colors.grey,
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 5,
        paddingRight: 15,
        

    },
    postTime:{
        color: colors.grey,
        fontSize: 13,
        fontWeight: '300'

    }
    
})