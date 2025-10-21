import React from 'react';
import { StyleSheet,View,TouchableOpacity} from 'react-native';
import colors from '../config/colors';
import {MaterialCommunityIcons} from '@expo/vector-icons'

function NewListingButton({onPress,style}) {
   return (
    <TouchableOpacity onPress={onPress}>

      <View style={[styles.container,style]}>
        <MaterialCommunityIcons name='plus-circle' color={colors.white} size={36} />

      </View>
    </TouchableOpacity>
   );
}


const styles = StyleSheet.create({
    container:{
        height:70,
        width: 70,
        borderRadius: 35,
        backgroundColor: colors.primary,
        bottom: 16,
        borderColor: colors.white,
        borderWidth: 8,
        alignItems: 'center',
        justifyContent: 'center',

    },


})


export default NewListingButton;