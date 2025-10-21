import React, { useState } from 'react';
import { StyleSheet,View, TouchableWithoutFeedback, Modal, FlatList, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'



import Screen from '../screens/Screen';
import defaultStyles from '../config/styles';
import AppText from './AppText';
import PickerItem from './PickerItem';




function AppPicker({icon, selectedItem, onSelectItem,items,placeholder,size, PickerItemComponent= PickerItem,numberOfColumns}) {
    const [modalVisible,setModalVisible] = useState(false)



    return (
        <>
        
        <TouchableWithoutFeedback onPress={()=> setModalVisible(true)}>

        <View style={[styles.container,{width:size}]}> 

        {icon && <MaterialCommunityIcons style={styles.icon} name={icon} size={20} color={defaultStyles.colors.grey} />}


        {selectedItem ? 
        <AppText style={styles.placeholder}>{selectedItem.title || selectedItem.name}</AppText> : 
        <AppText style={styles.placeholder}>{placeholder}</AppText>}

        
        <MaterialCommunityIcons name='chevron-down' size={20} color={defaultStyles.colors.grey} />


        </View>

        </TouchableWithoutFeedback>
        <Modal visible={modalVisible}  animationType='slide'>
            <Screen>
                <View style={{justifyContent:'center',alignItems:'center'}}>
                 
                 <Text style={{color:"#2596be", fontSize:18 }} onPress={()=> setModalVisible(false)}>
                    Close
                 </Text>
                </View>

            <FlatList 
            data={items}
            keyExtractor={item => item.id.toString()}
            numColumns={numberOfColumns}
            renderItem={({item}) => <PickerItemComponent item={item} 
            onPress={()=> { setModalVisible(false); onSelectItem(item); }}/>} />

            </Screen>

        </Modal>
        
        </>

        
        
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
    placeholder:{
        color: defaultStyles.colors.grey,
        flex: 1,
    },
 

})


export default AppPicker;
