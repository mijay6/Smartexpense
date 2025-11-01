import api from './api';

export const categoryService = {
  
  async getExpenseCategories() {
    const response = await api.get('/categories/expenses');
    return response.data;
  }

};

export default categoryService;