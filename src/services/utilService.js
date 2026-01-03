import api from './api';

export const typeService = {
    getAllTypes: async () => {
        const response = await api.get('/type');
        return response.data;
    },

    getTypeById: async (id) => {
        const response = await api.get(`/type/${id}`);
        return response.data;
    },
};

export const fieldUnitService = {
    getAllFieldUnits: async () => {
        const response = await api.get('/fieldunit');
        return response.data;
    },

    getFieldUnitById: async (id) => {
        const response = await api.get(`/fieldunit/${id}`);
        return response.data;
    },

    getFieldUnitsByField: async (fieldId) => {
        const response = await api.get(`/fieldunit/field/${fieldId}`);
        return response.data;
    },

    createFieldUnit: async (unitData) => {
        const response = await api.post('/fieldunit', unitData);
        return response.data;
    },

    updateFieldUnit: async (id, unitData) => {
        const response = await api.put(`/fieldunit/${id}`, unitData);
        return response.data;
    },

    deleteFieldUnit: async (id) => {
        const response = await api.delete(`/fieldunit/${id}`);
        return response.data;
    },
};

export const uploadService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },
};
