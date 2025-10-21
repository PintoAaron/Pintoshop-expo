import React from 'react';
import { Platform,Text , StyleSheet} from 'react-native';

function AppText({children,style, ...otherProps}) {
    return (
        <Text style={[styles.text,style]} {...otherProps}>{children}</Text>
    );
}

export default AppText;


const styles = StyleSheet.create({
    text:{
        fontSize: 17,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Avenir':'Roboto'
    }
    
})