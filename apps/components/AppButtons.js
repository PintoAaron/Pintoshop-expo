import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '../config/colors';

function AppButtons({title,onPress,color='primary'}) {
    return (
        <TouchableOpacity style = {[styles.button,{backgroundColor:colors[color]}]}  onPress={onPress}>
            <Text style={styles.text}>{title}</Text>

        </TouchableOpacity>
       
    );
}

export default AppButtons;

const styles = StyleSheet.create({
    button:{
        width:'100%',
        padding: 15,
        borderRadius:15,
        backgroundColor: colors.primary,
        justifyContent:'center',
        alignItems:'center',
        marginVertical: 8

    },
    text:{
        fontSize: 16,
        fontWeight:'600',
        textTransform: 'uppercase',
        color: colors.white
    }
    
})