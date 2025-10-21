import { useContext,useState, useEffect } from 'react';


import apiClient from '../api/auth';


const useCurrentUser = (userId) => {

    const [currentUser,setCurrentUser] = useState([]);


    const getUser = async (user_Id) => {
        const response = await apiClient.get('/auth/users/' + user_Id);
    
        if (!response.ok){
            
        }
            
    
        setCurrentUser(response.data);
}

    useEffect(()=>{
    
        getUser(userId);

    },[])

    return currentUser;


};

export default useCurrentUser;