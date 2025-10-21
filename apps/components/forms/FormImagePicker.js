import React from 'react';
import {useFormikContext} from 'formik'


import ImageInputList from '../ImageInputList';
import ImageInput from '../ImageInput';
import ErrorMessage from './ErrorMessage';





function FormImagePicker({name}) {

    const { errors,setFieldValue,values,touched} = useFormikContext();
    const ImageUris = values[name]

    const handleAdd = uri => {
        setFieldValue(name,[...ImageUris,uri])
      }
    
      const handleRemove =uri => {
        setFieldValue(name,ImageUris.filter(imageUri => imageUri !== uri));
      }

   return (
    <>
    <ImageInputList
    imageUris={ImageUris}
    onAddImage={handleAdd}
    onRemoveImage={handleRemove}  />

    <ErrorMessage error={errors[name]} visible={touched[name]}/>

    </>
      
   );
}




export default FormImagePicker;