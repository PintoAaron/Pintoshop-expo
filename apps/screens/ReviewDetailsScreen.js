import React, { useState } from 'react';
import { StyleSheet,Text,View,FlatList} from 'react-native';



import Screen from './Screen';
import colors from '../config/colors';
import ReplyItem from '../components/ReplyItem';
import ListItemSeparator from '../components/ListItemSeparator';
import screenRoute from '../navigation/route';
import ReviewListItem from '../components/ReviewListItem';


function ReviewDetailsScreen({route,navigation}) {

   const [refreshing,setRefreshing] = useState(false);

   const review = route.params

   const [replies,setReplies] = useState([]);
  
   return (
    <Screen>
        <View>

        <ReviewListItem 
          image={require('../assets/profile.jpg')}
          title={review.user.username} 
          subtitle={review.user.email} 
          message={review.message} 
          showDate={review.date_created}/>
        
        <View style ={{paddingLeft: 60}}>

        <Text style={{color: colors.primary,paddingTop: 5}} onPress={()=> navigation.navigate(screenRoute.NEW_REPLY,review)}>reply here</Text>
        <Text style={styles.email} onPress={()=> setReplies(review.replies)}>show replies</Text>
        <ListItemSeparator/>
        <FlatList 
            data={replies}
            keyExtractor={reply => reply.id.toString() }
            renderItem={({item}) => 
            <ReplyItem 
            message={item.reply}
            replier={item.user.username} 
            time= {item.date_created}
            /> 
        }
        ItemSeparatorComponent={ListItemSeparator}
        refreshing = {refreshing}
        onRefresh={ ()=> console.log("")}
        
        /> 
        </View>
            </View>
    </Screen>
     
   );
}


const styles = StyleSheet.create({

    text:{
        marginBottom: 10,
        fontSize: 14,
        color: colors.grey

    },
    postTime:{
        fontSize: 14,
        color: colors.grey,
        marginBottom: 10
    },
    container:{
        paddingLeft: 10,
       

    },
    email:{
        marginBottom: 10,
        paddingTop: 15,
        fontSize: 14,
        color: '#337AB7'
    }



})


export default ReviewDetailsScreen;