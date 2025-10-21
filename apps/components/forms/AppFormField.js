import React from 'react';
import { useFormikContext} from 'formik'


import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';
 
function AppFormField({name,fieldWidth,style,...otherProps}) {

    const { errors,setFieldTouched,touched,values,setFieldValue} = useFormikContext();
    return (
      <>
            <AppTextInput 
                onBlur = {()=> setFieldTouched(name)}
                onChangeText = {(text) => setFieldValue(name,text)}
                value={values[name]}
                size={fieldWidth}
                {...otherProps}
                style={style}
        
            />
            
            <ErrorMessage error={errors[name]} visible={touched[name]}/>
      </>
    );
}

export default AppFormField;