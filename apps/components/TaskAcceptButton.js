import React from 'react';
import { StyleSheet,TouchableOpacity,TouchableWithoutFeedback,View } from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

function TaskAcceptButton({title,style,onPress}) {
   return (
    <TouchableOpacity onPress={onPress}>

      <View style={[styles.container,title === "REQUEST SENT"?styles.green:style]}>

        <AppText style={styles.text}>{ title }</AppText>
        

      </View>

    </TouchableOpacity>
   );
}


const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: 15,
       
  
    },
    text:{
        color: colors.white,
        padding: 10,
        fontWeight: '900',
        fontSize: 13
        

    },
    green:{
        backgroundColor: colors.green

    }


})


export default TaskAcceptButton;