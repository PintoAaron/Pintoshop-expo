import { useState } from 'react';


const useApi = (apiFunc) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const request = async (...args) => {
        setLoading(true);
        try {
            const response = await apiFunc(...args);
            setError(!response.ok);
            setData(response.data);
            return response;
        } catch (err) {
            setError(true);
            return { ok: false, data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, request };
};

export default useApi;