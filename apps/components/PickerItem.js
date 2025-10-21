import React from 'react';
import { TouchableOpacity,StyleSheet, View,Text } from 'react-native';



function PickerItem({item,onPress}) {
    return (
        <TouchableOpacity onPress={onPress}>

            <View style={styles.textContainer}>
           
            <Text style={styles.text}>
                {item.label}
            </Text>
            

            </View>
        </TouchableOpacity>
      
    );
}



const styles = StyleSheet.create({
    text:{
        padding:8,
        fontSize:16,
        fontWeight: '600',
    
    },
    textContainer:{
        borderBottomColor: 'transparent',
        marginBottom: 10,

    }
})

export default PickerItem;