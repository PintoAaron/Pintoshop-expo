import { useState, useEffect } from 'react';
import * as Location from 'expo-location'

const useLocation = () => {
    
    const [loation,setLocation] = useState();

    const getLocation = async () => {
        try {
               
            const {granted} = await Location.requestForegroundPermissionsAsync();
            if (!granted) return;
            const {coords: {latitude,longitude}} = await Location.getLastKnownPositionAsync();
            setLocation({latitude,longitude});
            
        } catch (error) {
           
            
        }
    }


    useEffect(()=>{
        getLocation();
    },[])


    return loation;

};


export default useLocation;