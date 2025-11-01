import { create } from 'zustand';
import { expenseService } from '../services/expenseService';
import { categoryService } from '../services/categoryService';

export const useExpenseStore = create((set, get) => ({

    // initial state
    expenses: [],
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
        try{
            set({ loading: true, error: null});
            const data = await categoryService.getExpenseCategories();
            set({ categories: data.categories , loading: false})  
        }
        catch(error){
            set({ error: 'Failed to fetch categories', loading: false });
            throw error;
        }
    },
    
    fetchExpenses: async (filters = {}) => {
        try {
            set({ loading: true, error: null, filters });
            const data = await expenseService.getExpenses(filters);
            set({ expenses: data.expenses, pagination: data.pagination, loading: false });
        }
        catch (error) {
            set({ error: 'Failed to fetch expenses', loading: false });
            throw error;
        }
    },

    createExpense: async (data) => {
        try {
            set({ loading : true, error: null });
            const res = await expenseService.createExpense(data);
            
            // reload expenses
            await get().fetchExpenses(get().filters);

            set({ loading: false });
            return res.expense;
        }
        catch (error) {
            set({ error: 'Failed to create expense', loading: false });
            throw error;
        }
    },

    updateExpense : async (id, data) => {
        try {
            set({loading : true, error: null });
            const res = await expenseService.updateExpense(id, data);

            await get().fetchExpenses(get().filters);

            set({ loading: false });
            return res.expense;
        }
        catch(error){
            set({ error: 'Failed to update expense', loading: false });
            throw error; 
        }
    },

    deleteExpense: async (id) => {
        try {
            set({ loading: true, error: null });
            await expenseService.deleteExpense(id);

            await get().fetchExpenses(get().filters);

            set({ loading: false });
        }
        catch (error) {
            set({ error: 'Failed to delete expense', loading: false });
            throw error; 
        }
    }
}));

export default useExpenseStore;