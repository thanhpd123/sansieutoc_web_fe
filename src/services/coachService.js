import api from './api';

export const coachService = {
    getAllCoaches: async () => {
        const response = await api.get('/coach');
        return response.data;
    },

    getCoachById: async (id) => {
        const response = await api.get(`/coach/${id}`);
        return response.data;
    },

    createCoach: async (coachData) => {
        const response = await api.post('/coach', coachData);
        return response.data;
    },

    updateCoach: async (id, coachData) => {
        const response = await api.put(`/coach/${id}`, coachData);
        return response.data;
    },

    deleteCoach: async (id) => {
        const response = await api.delete(`/coach/${id}`);
        return response.data;
    },
};

export const coachBookingService = {
    getAllCoachBookings: async () => {
        const response = await api.get('/coachbooking');
        return response.data;
    },

    getUserCoachBookings: async () => {
        const response = await api.get('/coachbooking/user');
        return response.data;
    },

    getCoachBookingById: async (id) => {
        const response = await api.get(`/coachbooking/${id}`);
        return response.data;
    },

    createCoachBooking: async (bookingData) => {
        const response = await api.post('/coachbooking', bookingData);
        return response.data;
    },

    updateCoachBooking: async (id, bookingData) => {
        const response = await api.put(`/coachbooking/${id}`, bookingData);
        return response.data;
    },

    deleteCoachBooking: async (id) => {
        const response = await api.delete(`/coachbooking/${id}`);
        return response.data;
    },
};
