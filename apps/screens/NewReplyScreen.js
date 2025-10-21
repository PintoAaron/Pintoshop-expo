import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';



import Screen from './Screen';
import { AppForm, AppFormField, SubmitButton} from '../components/forms'
import listingsApi from '../api/listings';
import UploadScreen from '../components/UploadScreen';


const validationSchema = Yup.object().shape({

    message: Yup.string().required().label('Message'),
   
})



function NewReplyScreen({route}) {

    const review = route.params

    const [uploadVisible,setUploadVisible] = useState(false);
    const [progress,setProgress] = useState(0);

    const handleSubmit = async (reply, actions) => {
        setProgress(0);
        setUploadVisible(true);
        const result = await listingsApi.addReply(reply,review.item_id,review.id,progress => setProgress(progress));
      

        if (!result.ok){
            console.error(result.problem)
            setUploadVisible(false);

            return;
        }
        
        actions.resetForm();

    }


    return (


        <Screen style={styles.screen}>
            <UploadScreen onDone={()=> setUploadVisible(false)} progress={progress} visible = {uploadVisible}/>

            <AppForm 
            
            initialValues={{ 
                message: "",
                
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema} >
         
           <AppFormField
            name = "message"
            placeholder = ""
            maxLength = {255}
            multilines
            numberOfLines = {2} 
            />
          
            <SubmitButton title="Post" />


            </AppForm>




        </Screen>
       
    );
}


const styles = StyleSheet.create({
    screen: {
        padding: 10,
    }
})



export default NewReplyScreen;
