import { useContext } from "react"
import jwtDecode from "jwt-decode";


import AuthContext from "../auth/context"
import authStorage from "../auth/storage";



const useAuth = () => {

    const {user,setUser} = useContext(AuthContext);

    const login = (token) => {
        const user = jwtDecode(token);
        setUser(user);
        authStorage.storeToken(token)

    }

    const logout = () => {

        setUser(null);
        authStorage.removeToken();

    };



    return {user,setUser, login,logout};

}

export default useAuth;