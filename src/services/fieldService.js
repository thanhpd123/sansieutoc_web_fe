import api from './api';

export const fieldService = {
    getAllFields: async () => {
        const response = await api.get('/field');
        return response.data;
    },

    getFieldById: async (id) => {
        const response = await api.get(`/field/${id}`);
        return response.data;
    },

    getFieldsByOwner: async () => {
        const response = await api.get('/field/owner');
        return response.data;
    },

    getAllFieldsAdmin: async () => {
        const response = await api.get('/field/admin');
        return response.data;
    },

    createField: async (fieldData) => {
        const response = await api.post('/field', fieldData);
        return response.data;
    },

    updateField: async (id, fieldData) => {
        const response = await api.put(`/field/${id}`, fieldData);
        return response.data;
    },

    deleteField: async (id) => {
        const response = await api.delete(`/field/${id}`);
        return response.data;
    },

    getFieldsByType: async (typeId) => {
        const response = await api.get(`/field?typeId=${typeId}`);
        return response.data;
    },
};
