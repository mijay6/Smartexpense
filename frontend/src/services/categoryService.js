import api from './api';

export const categoryService = {
  
  async getExpenseCategories() {
    const res = await api.get('/categories/expenses');
    return res.data;
  },

  async getIncomeCategories(){
    const res = await api.get('/categories/incomes');
    return res.data;
  }

};

export default categoryService;