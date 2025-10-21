import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';


import Icon from './Icon';

function CategoryPickerItem({item, onPress}) {
    return (

    <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
        <Icon 
            backgroundColor={item.background_color || item.backgroundColor || "#6c5ce7"} 
            name={item.icon || "apps"} 
            size={60}  
        />
        </TouchableOpacity>
        <Text style={styles.text}>{item.title || item.name}</Text>
        {item.product_count !== undefined && (
            <Text style={styles.countText}>{item.product_count} products</Text>
        )}
    </View>
    );
}


const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        paddingVertical:12,
        alignItems: 'center',
        width:"32%"

    },
    text:{
        marginTop:8,
        fontWeight: "500",
        fontSize: 14,
        textAlign:"center",
        
    },
    countText:{
        marginTop:3,
        fontSize:11,
        color:"#888",
        textAlign:"center",
    }
    
})
export default CategoryPickerItem;
