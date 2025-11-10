import api from './api';

export const incomeService = {

    async getIncomes(filters = {}) {

        const params = new URLSearchParams();

        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.minAmount) params.append('minAmount', filters.minAmount);
        if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
        if (filters.search) params.append('search', filters.search);
        if (filters.page) params.append('page', filters.page);
        if (filters.limit) params.append('limit', filters.limit);

        const res = await api.get(`/incomes?${params.toString()}`);
        return res.data;
    },

    async getIncome(id){
        const res = await api.get(`/incomes/${id}`);
        return res.data;
    },

    async createIncome(data) {
        const res = await api.post('/incomes', data);
        return res.data;
    },

    async updateIncome(id, data) {
        const res = await api.put(`/incomes/${id}`, data);
        return res.data;
    },

    async deleteIncome(id) { 
        const res = await api.delete(`/incomes/${id}`);
        return res.data;
    }
}

export default incomeService;
 