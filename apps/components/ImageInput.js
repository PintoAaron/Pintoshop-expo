import React, { useEffect } from 'react';
import { StyleSheet,View ,Image,TouchableWithoutFeedback, Alert} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'



import defaultStyles from '../config/styles'

function ImageInput({imageUri,onChangeImage}) {



    useEffect(() =>{
        requestPermission();
    },[])

    
    const requestPermission = async () => {
        const result =  await ImagePicker.requestCameraPermissionsAsync();
        if (!result.granted)
        alert('You have to have permissions to proceed')
    }
    
    



    const selectImage = async () => {
        try {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.5,
          });
          if (!result.canceled)
             onChangeImage(result.assets[0].uri);
    
        } catch (error) {
          
          
        }
      }
    

      const handlePress = () =>{
        if (!imageUri)
           selectImage();
        else Alert.alert('Delete', 'Are you sure you want to delete this image',[
            {text:'Yes', onPress: ()=> onChangeImage(null)},
            {text:'No' }
   
    ])
      }



   return (     
    
    
      <TouchableWithoutFeedback onPress={handlePress}>

      <View style={styles.container}>

        {!imageUri && <MaterialCommunityIcons name='camera' size={40} color={defaultStyles.colors.black}/>}

        {imageUri && <Image source={{uri: imageUri}} style={styles.image}/>}

      </View>

      </TouchableWithoutFeedback>
     
   );
}


const styles = StyleSheet.create({
    container:{
        width: 100,
        height: 100,
        borderRadius: 15,
        backgroundColor: defaultStyles.colors.light,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',

    },
    image:{
        width: "100%",
        height: "100%"
    }


})


export default ImageInput;