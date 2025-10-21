import React from 'react';
import { StyleSheet,View,TouchableWithoutFeedback,Text,TouchableOpacity } from 'react-native'
import { Image } from 'react-native-expo-image-cache';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from './Icon';



import colors from '../config/colors';
import AppText from './AppText';
import ListItemWithRating from './ListItemWithRating';


function CardWithDelete({title,imageUrl,onPress,RequesterTitle,Requestersubtitle, renderRightActions, task_status,onLongPress,DeclineRequest,AcceptRequest,email,ACCEPTED}) {
    return (
        <Swipeable renderRightActions={renderRightActions}>

        <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
        <View style={styles.card}>
            <Image style={styles.image} uri={imageUrl}/>
            <View style={styles.detailscontainer}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1}}>
                      
                      <AppText style={styles.title} >{title}</AppText>

                    </View>
                    <Text style={{fontSize: 14,paddingRight: 10,color: colors.secondary}}>TASK {task_status}</Text>

                </View>
              <ListItemWithRating
              IconComponent={<Icon name='account' size={45} backgroundColor={colors.grey}/>}
              title={RequesterTitle} 
              email={email}
              subtitle={ Requestersubtitle }/>
          
            </View>
            { task_status === 'PENDING' ?

                <View style={{marginBottom: 10, flexDirection:'row',paddingLeft: 20,paddingRight: 20}}>
                
               <View style={{flex:1}}>

                <TouchableOpacity onPress={AcceptRequest}>

                <View style={styles.declineButton}>
                    <Text style={styles.text}>
                    {ACCEPTED}
                    </Text>

                </View>
                </TouchableOpacity>
               </View>
               
                {ACCEPTED === "ACCEPTED"?
                
                null:
                
                <TouchableOpacity onPress={DeclineRequest}>

                <View style={[styles.button]} >
                    <Text style={styles.text} >DECLINE</Text>

                </View>
                </TouchableOpacity>}
              
            </View> :
            null
            
            } 

        </View>
        
        </TouchableWithoutFeedback>
        </Swipeable>
    );
}

export default CardWithDelete;

const styles = StyleSheet.create({
    card:{
        backgroundColor: colors.white,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 10
    },
    image:{
        width:'100%',
        height: 100,
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
        fontSize: 15,
        flex:1,
        marginTop: 6

    },
    postTime:{
        paddingRight: 5,
        fontSize: 12,
        color: colors.grey
    },
    text:{
        color: colors.white,
        padding: 10,
        fontWeight: '900',
        fontSize: 15
    
    },
    button:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 15,
        
      
    },
    
    declineButton:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.green,
        borderRadius: 15,
        width: '50%',
        
    },

})