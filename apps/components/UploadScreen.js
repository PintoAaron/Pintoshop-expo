import React from 'react';
import { Modal, StyleSheet,View } from 'react-native';
import * as Progress from 'react-native-progress';
import LottieView from 'lottie-react-native'



import colors from '../config/colors';

function UploadScreen({progress = 0 ,visible = false,onDone}) {
   return (
    <Modal visible = {visible}>
        
        <View style={styles.container}>
            {progress < 1 ?
            <Progress.Bar progress={progress} color={colors.primary} width={200}/>:
            <LottieView autoPlay loop={false} source={require('../assets/animations/done.json')} style={styles.animation} onAnimationFinish={onDone}/>
            }
        </View>

    </Modal>
   );
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    animation:{
        width: '50%'
    }


})


export default UploadScreen;