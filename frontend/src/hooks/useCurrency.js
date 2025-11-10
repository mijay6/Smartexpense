import { useAuthStore } from '../stores/authStore';
import { formatCurrency, formatCurrencyChange, getCurrencySymbol } from '../utils/currency';


export const useCurrency = () => {
  const { user } = useAuthStore();
  const userCurrency = user?.currency || 'EUR';

  return {
    
    currency: userCurrency,
    
    symbol: getCurrencySymbol(userCurrency),
    
    format: (amount, options = {}) => formatCurrency(amount, userCurrency, options),
    formatChange: (amount, showSign = true) => formatCurrencyChange(amount, userCurrency, showSign),
    formatWith: (amount, currencyCode, options = {}) => formatCurrency(amount, currencyCode, options),
  };
};

export default useCurrency;
