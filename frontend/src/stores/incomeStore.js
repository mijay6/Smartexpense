import { create } from 'zustand';
import { incomeService } from '../services/incomeService';
import { categoryService } from '../services/categoryService';

export const useIncomeStore = create((set, get) => ({

    // initial state
    incomes:[],
    categories: [],
    loading: false,
    error: null,
    filters: {},
    pagination: {
        page: 1,
        limit: 50,
        total: 0,
        pages: 1
    },

    fetchCategories: async () => {
        try {
            set({ loading: true, error: null});
            const data = await categoryService.getIncomeCategories();
            set({ categories: data.categories, loading: false})
        }
        catch(error){
            set({ error: 'Failed to fetch categories', loading: false });
            throw error;
        }
    },

    fetchIncomes: async (filters = {}) => {
        try {
            set({ loading: true, error: null, filters });
            const data = await incomeService.getIncomes(filters);
            set({ incomes: data.incomes, pagination: data.pagination, loading: false });
        }
        catch (error){
            set({ error: 'Failed to fetch incomes', loading: false });
            throw error;
        }
    },

    createIncome: async (data) => {
        try {
            set({ loading: true, error: null });
            const res = await incomeService.createIncome(data);

            // reload incomes
            await get().fetchIncomes(get().filters);

            set({ loading: false });
            return res.income;
        }
        catch (error){
            set({ error: 'Failed to create income', loading: false });
            throw error;
        }
    },

    updateIncome : async (id, data) => {
        try {
            set({loading : true, error: null });
            const res = await incomeService.updateIncome(id, data);

            await get().fetchIncomes(get().filters);

            set({ loading: false });
            return res.income;
        }
        catch(error){
            set({ error: 'Failed to update income', loading: false });
            throw error;
        }
    },

    deleteIncome: async (id) => {
        try {
            set({ loading: true, error: null });
            await incomeService.deleteIncome(id);

            await get().fetchIncomes(get().filters);

            set({ loading: false });
        }
        catch (error){
            set({ error: 'Failed to delete income', loading: false });
            throw error;
        }
    }
}));

export default useIncomeStore;