import api from './api';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
    },

    getCurrentUser: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    saveUserData: (userData) => {
        localStorage.setItem('userData', JSON.stringify(userData));
    },

    getAllUsers: async () => {
        const response = await api.get('/auth');
        return response.data;
    },

    getUsersByRole: async (role) => {
        const response = await api.get(`/auth/users?role=${role}`);
        return response.data;
    },

    getManagerCount: async () => {
        const response = await api.get('/auth/count/manager');
        return response.data;
    },
};
