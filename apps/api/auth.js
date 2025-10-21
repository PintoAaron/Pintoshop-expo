import { create } from 'apisauce'
import authStorage from '../auth/storage';


const apiClient = create({
    baseURL: 'http://192.168.43.233:8000',
})

// Add authentication to all requests
const addAuthToRequest = async (config) => {
    const token = await authStorage.getToken();
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `JWT ${token}`
        };
    }
    return config;
};

const login = (email, password) => {
    console.log('Login data:', { email, password }); // Debug log
    return apiClient.post('/auth/jwt/create', { email, password });
};

const register = (userInfo) => {
    console.log('Register data:', userInfo); // Debug log
    return apiClient.post('/auth/users/', userInfo);
};

const getUsers = async () => {
    const token = await authStorage.getToken();
    
    if (token) {
        const config = {
            headers: {
                'Authorization': `JWT ${token}`
            }
        };
        const response = await apiClient.get('/auth/users/', {}, config);
        return response;
    } else {
        return { ok: false, data: null };
    }
};

export default {
    login,
    register,
    getUsers,
};