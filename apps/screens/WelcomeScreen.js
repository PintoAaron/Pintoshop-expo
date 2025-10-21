import React from 'react';
import { Image, ImageBackground,StyleSheet, Text, View } from 'react-native';


import AppButtons from '../components/AppButtons';
import colors from '../config/colors';

function WelcomeScreen({navigation}) {
    return (
        <ImageBackground blurRadius={0} style={styles.background} source={require('../assets/shopcart.png')}>
            <View style={styles.logoContainer}>

                <Image style={styles.logo} source={require('../assets/logo.png')} />
                <Text style={styles.tagline}>Sell Happily, Buy Happily</Text>
                
            </View>

            <View style={styles.buttoncontainer}>
                <AppButtons title='Login'  onPress={()=> navigation.navigate("Login")}  />
                <AppButtons title='Register' color='secondary' onPress={()=> navigation.navigate("Register")} />
            </View>




        </ImageBackground>
       
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    background:{
        flex:1,
        justifyContent: 'flex-end',
        alignItems: 'center',


    },

    logo:{
        width:220,
        height:100,
    },

    logoContainer:{
        position: 'absolute',
        top:70,
        alignItems: 'center',   
    

    },

    buttoncontainer:{
        width:'100%',
        padding: 20

    },
    tagline:{
        fontSize:15,
        fontWeight:'400',
        paddingTop: 5,
        
    },

    
})

   
    

    
