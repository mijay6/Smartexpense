import api from './api';

export const expenseService = {

    async getExpenses(filters = {}) {

        const params = new URLSearchParams();

        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.minAmount) params.append('minAmount', filters.minAmount);
        if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const res = await api.get(`/expenses?${params.toString()}`);
        return res.data;
    },

    async getExpense(id){
        const res = await api.get(`/expenses/${id}`);
        return res.data;
    },

    async createExpense(data) {
        const res = await api.post('/expenses', data);
        return res.data;
    },

    async updateExpense(id, data) {
        const res = await api.put(`/expenses/${id}`, data);
        return res.data;
    },

    async deleteExpense(id) {
        const res = await api.delete(`/expenses/${id}`);
        return res.data;
    }

}

export default expenseService;