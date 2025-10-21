import React from 'react';
import { useFormikContext}  from 'formik'


import ErrorMessage from './ErrorMessage';
import AppPicker from '../AppPicker';

function AppFormPicker({items,name,placeholder,fieldWidth,PickerItemComponent,numberOfColumns=1}) {

    const { errors,setFieldValue,values,touched} = useFormikContext();
    return (
        <>
        

        <AppPicker
         PickerItemComponent={PickerItemComponent}
         numberOfColumns={numberOfColumns}
         items={items} 
         size={fieldWidth}
         placeholder={placeholder}
         onSelectItem={(item)=>setFieldValue(name,item)}
         selectedItem={values[name]} >

        </AppPicker>
        
        <ErrorMessage error={errors[name]} visible={touched[name]}/>
       
        </>
    );
}

export default AppFormPicker;