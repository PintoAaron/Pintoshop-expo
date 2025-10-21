import { create } from 'apisauce'
import cache from '../utility/cache';
import authStorage from '../auth/storage';


// baseURL: 'https://e-commerce-ud7p.onrender.com/shop'
const apiClient = create({
    baseURL: 'http://192.168.43.233:8000/shop',
});

// Override methods to include authentication
const originalGet = apiClient.get;
const originalPost = apiClient.post;
const originalPut = apiClient.put;
const originalPatch = apiClient.patch;
const originalDelete = apiClient.delete;

apiClient.post = async (url, data, axiosConfig = {}) => {
    const token = await authStorage.getToken();
    console.log('POST request token:', token ? 'Token found' : 'No token');
    
    if (token) {
        axiosConfig.headers = {
            ...axiosConfig.headers,
            'Authorization': `JWT ${token}`
        };
    }
    
    console.log('POST request headers:', axiosConfig.headers);
    return originalPost(url, data, axiosConfig);
};

apiClient.put = async (url, data, axiosConfig = {}) => {
    const token = await authStorage.getToken();
    if (token) {
        axiosConfig.headers = {
            ...axiosConfig.headers,
            'Authorization': `JWT ${token}`
        };
    }
    return originalPut(url, data, axiosConfig);
};

apiClient.patch = async (url, data, axiosConfig = {}) => {
    const token = await authStorage.getToken();
    if (token) {
        axiosConfig.headers = {
            ...axiosConfig.headers,
            'Authorization': `JWT ${token}`
        };
    }
    return originalPatch(url, data, axiosConfig);
};

apiClient.delete = async (url, axiosConfig = {}) => {
    const token = await authStorage.getToken();
    if (token) {
        axiosConfig.headers = {
            ...axiosConfig.headers,
            'Authorization': `JWT ${token}`
        };
    }
    return originalDelete(url, axiosConfig);
};

// Store the original get method for cache functionality
const get = originalGet;

// Override get method with cache functionality
apiClient.get = async (url,params,axiosConfig = {}) => {
    // Add authentication
    const token = await authStorage.getToken();
    if (token) {
        axiosConfig.headers = {
            ...axiosConfig.headers,
            'Authorization': `JWT ${token}`
        };
    }
    
    const response = await originalGet(url, params, axiosConfig);

    if (response.ok){
        cache.store(url, response.data);
        return response;
    }

    const data = await cache.get(url);
    return data ? {ok: true,data}: response;
}


export default apiClient;

