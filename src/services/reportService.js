import api from './api';

export const reportService = {
    getOwnerRevenue: async (params) => {
        const response = await api.get('/report/owner', { params });
        return response.data;
    },

    getRevenueByField: async (params) => {
        const response = await api.get('/report/field', { params });
        return response.data;
    },

    getRevenueBySlot: async (params) => {
        const response = await api.get('/report/slot', { params });
        return response.data;
    },

    compareRevenueByMonth: async (year) => {
        const response = await api.get(`/report/compare/month?year=${year}`);
        return response.data;
    },

    compareRevenueByYear: async () => {
        const response = await api.get('/report/compare/year');
        return response.data;
    },
};
