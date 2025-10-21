import React, { useState } from 'react';
import { StyleSheet, View ,Image,Text, ScrollView} from 'react-native';
import * as Yup from 'yup';




import defaultStyles from '../config/styles';
import {AppForm,AppFormField,SubmitButton,ErrorMessage} from '../components/forms'
import colors from '../config/colors';
import authApi from '../api/auth';
import useAuth from '../hooks/useAuth';


const validationSchema = Yup.object().shape(
    {
        email: Yup.string().required().email().label('Email'),
        password: Yup.string().required().min(5).label('Password'),

    }
)

function LoginScreen({navigation}) {

    const { login }= useAuth();
    const [loginFailed,setLoginFailed] = useState(false);

    const handleSubmit = async (loginInfo,actions) => {
        const result = await authApi.login(loginInfo.email,loginInfo.password);

        console.log(result);

        if (!result.ok){
            return setLoginFailed(true);
        }
        
        setLoginFailed(false);
        login(result.data['access']);
        actions.resetForm();
    navigation.navigate('Home');
    }




    return (
        
        <View>
    
        
            <View style={styles.container}>
               
                <Image style={styles.logo} source={require('../assets/logo.png')}/>
                <Text style={{fontStyle:'italic',color:colors.black}}> sell happily, buy happily </Text>
               
            </View>
            <View style={{flexDirection:'row', padding:20,marginBottom:10}}>
                <Text style={{fontStyle:'italic',color:colors.grey}}>Don't have an account? </Text>
                <Text style={{ color:colors.primary}} onPress={()=> navigation.navigate("Register")}>Sign Up </Text>
            </View>

            <View style={styles.formContainer}>
            

            <AppForm
            initialValues={{ email:"", password:""}}
            onSubmit={handleSubmit}  
            validationSchema={validationSchema} >

                <ErrorMessage error="Invalid email or password" visible={loginFailed}/>
                <AppFormField
                style={styles.Textinput}
                name="email"
                icon='email'
                placeholder='Email'
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType='email-address'
                textContentType='emailAddress'
                />

                <AppFormField
                style={styles.Textinput}
                name="password"
                icon='lock'
                placeholder='Password'
                autoCapitalize='none'
                autoCorrect={false}
                textContentType='password'
                secureTextEntry
                />

                <SubmitButton title="Login"/>

            </AppForm>
                


            </View>
        </View>
    
       
    );
}



const styles = StyleSheet.create({

    container:{
        width: '100%',
        height: '40%',
        backgroundColor: colors.grey,
        marginBottom: 10,
        borderBottomLeftRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
        
      

    },

    formContainer:{
        padding: 10

    },
    logo:{
        width:260,
        height: 150,
        alignSelf: 'center',

    },
    Textinput:{
        borderWidth:1,
        borderColor: defaultStyles.colors.secondary

    }

   
    
})


export default LoginScreen;