import React from 'react';
import { StyleSheet,TextInput,View,Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'



import Screen from '../screens/Screen';
import defaultStyles from '../config/styles';

function AppTextInput({size,icon,style,...otherProps}) {
    return (
        

        <View style={[styles.container,{width:size},style]}> 

        {icon && <MaterialCommunityIcons style={styles.icon} name={icon} size={20} color={defaultStyles.colors.grey} />}


        <TextInput 
        placeholderTextColor={defaultStyles.colors.grey}
        style={[defaultStyles.text,{flex:1}]} 
        {...otherProps}  
        
        />

        </View>
        
    );
}



const styles = StyleSheet.create({
    container:{
        width:'100%',
        backgroundColor:defaultStyles.colors.light,
        padding: 15,
        borderRadius:25,
        flexDirection:'row',
        marginVertical: 10,
        
        
    },

    icon:{
        marginRight:10,

    },
    

})


export default AppTextInput;
