import React from 'react';
import { StyleSheet,View,Text} from 'react-native';
import moment from 'moment';


import colors from '../config/colors';


function ReplyItem({ message,replier,time}) {
   return (
      <View style={styles.container}>
        <View style = {{flexDirection: 'row'}}>
                <Text style={{fontSize: 15, fontWeight: '500',color: colors.secondary}}>{replier} @</Text>
                <Text style ={{ color: colors.grey}}>{moment(time).format('HH:mm a')} </Text>
        </View>
        <View style={{paddingTop: 6 }}>
            <Text style={{fontSize: 14, color: colors.grey, fontWeight:'500'}}>{message}</Text>
        </View>
      </View>
   );
}


const styles = StyleSheet.create({
    container:{
        padding: 10

    },


})


export default ReplyItem;