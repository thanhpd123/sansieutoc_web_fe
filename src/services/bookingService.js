import api from './api';

export const bookingService = {
    getAllBookings: async () => {
        const response = await api.get('/booking');
        return response.data;
    },

    getUserBookings: async () => {
        const response = await api.get('/booking/user');
        return response.data;
    },

    getOwnerBookings: async () => {
        const response = await api.get('/booking/owner');
        return response.data;
    },

    getAdminBookings: async () => {
        const response = await api.get('/booking/admin');
        return response.data;
    },

    getAdminBookingsList: async () => {
        const response = await api.get('/booking/admin/bookings');
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await api.get(`/booking/${id}`);
        return response.data;
    },

    createBooking: async (bookingData) => {
        const response = await api.post('/booking', bookingData);
        return response.data;
    },

    updateBooking: async (id, bookingData) => {
        const response = await api.put(`/booking/${id}`, bookingData);
        return response.data;
    },

    deleteBooking: async (id) => {
        const response = await api.delete(`/booking/${id}`);
        return response.data;
    },

    getTodayBookingCount: async () => {
        const response = await api.get('/booking/today-count');
        return response.data;
    },

    getBookingsByField: async (fieldId, date) => {
        const response = await api.get(`/booking/field/${fieldId}?date=${date}`);
        return response.data;
    },
};
