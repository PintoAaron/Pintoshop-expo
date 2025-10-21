import React from 'react';
import { useFormikContext } from 'formik'

import AppButtons from '../AppButtons';

function SubmitButton({title, color = 'primary'}) {

    const { handleSubmit } = useFormikContext();   
    

    return (
        <AppButtons title={title} color={color} onPress={handleSubmit}/>
    );
}

export default SubmitButton;