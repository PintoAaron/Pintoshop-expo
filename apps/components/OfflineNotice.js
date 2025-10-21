import React from 'react';
import { StyleSheet,View } from 'react-native';
import  Constants from 'expo-constants';
import { useNetInfo } from '@react-native-community/netinfo'


import AppText from './AppText';
import colors from '../config/colors';

function OfflineNotice(props) {

    const netInfo = useNetInfo();


    if (netInfo.type !== "unknown" && netInfo.isInternetReachable === false) {

        return (
           <View style={styles.container}>
             <AppText style={styles.text}> No Internet Connection </AppText>
           </View>
        );

    }

    return null;




}


const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        backgroundColor: colors.primary,
        justifyContent: 'center',
        position: 'absolute',
        height: 40,
        width: '100%',
        top: Constants.statusBarHeight,
        zIndex: 1

    },
    text:{
        color: colors.white,
    }


})


export default OfflineNotice;