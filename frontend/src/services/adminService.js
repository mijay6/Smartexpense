import api from './api';

export const adminService = {

    async getGlobalStats() {
        const res = await api.get('/admin/stats');
        return res.data;
    },

    async getAllUsers(filters = {}) {
        const params = new URLSearchParams();
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.search) params.append('search', filters.search);
        if (filters.role) params.append('role', filters.role);

        const res = await api.get(`/admin/users?${params.toString()}`);
        return res.data;
    },

    async getUserById(id) {
        const res = await api.get(`/admin/users/${id}`);
        return res.data;
    },

    async createUser(userData) {
        const res = await api.post('/admin/users', userData);
        return res.data;
    },

    async updateUserRole(id, role) {
        const res = await api.patch(`/admin/users/${id}/role`, { role });
        return res.data;
    },

    async deleteUser(id) {
        const res = await api.delete(`/admin/users/${id}`);
        return res.data;
    }
};