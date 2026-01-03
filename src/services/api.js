import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
});

// Auto-inject JWT token
api.interceptors.request.use((config) => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData?.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
    }
    return config;
});

// Auto-redirect on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
