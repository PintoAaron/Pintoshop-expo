import React from 'react';
import { StyleSheet,View } from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';

function TaskStatusButton({title ='PENDING'}) {

    let color;

    if (title === 'IN PROGRESS') {
      color = colors.blue;
    } else if (title === 'COMPLETED') {
      color = colors.green;
    } else {
    
      color = colors.black;
    }
   return (
    

      <View style={[styles.container,{backgroundColor: color}]}>

        <AppText style={styles.text}> TASK {title}</AppText>
        

      </View>

   );
}


const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.grey,
        borderRadius: 15,
        width: '45%'
    


    },
    text:{
        color: colors.white,
        padding: 10,
        fontWeight: '900',
        fontSize: 13
        

    },
   

})


export default TaskStatusButton;