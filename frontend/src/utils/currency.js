
// Currency symbols mapping
export const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  BGN: 'лв',
  BRL: 'R$',
  MXN: 'MX$',
  ZAR: 'R',
  TRY: '₺',
  RUB: '₽',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  NZD: 'NZ$',
  THB: '฿',
  MYR: 'RM',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
  AED: 'د.إ',
  SAR: 'SR',
  EGP: 'E£'
};

// Currencies that use symbol after amount
export const SYMBOL_AFTER_AMOUNT = ['SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN'];

// Currencies that don not use decimals
export const NO_DECIMAL_CURRENCIES = ['JPY', 'KRW', 'VND', 'IDR'];


export const getCurrencySymbol = (currencyCode = 'EUR') => {
  return CURRENCY_SYMBOLS[currencyCode.toUpperCase()] || currencyCode;
};


export const formatCurrency = (amount, currencyCode = 'EUR', options = {}) => {
  const {
    showDecimals = true,
    locale = 'en-GB',
    useNativeFormat = false
  } = options;

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '0';

  const currency = currencyCode.toUpperCase();
  const symbol = getCurrencySymbol(currency);
  
  // Use native Intl.NumberFormat if requested
  if (useNativeFormat) {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: NO_DECIMAL_CURRENCIES.includes(currency) ? 0 : 2,
        maximumFractionDigits: NO_DECIMAL_CURRENCIES.includes(currency) ? 0 : 2
      }).format(numAmount);
    } catch {
      // Fallback if currency is not supported
      console.warn(`Currency ${currency} not supported by Intl.NumberFormat`);
    }
  }

  // Manual formatting
  const decimals = NO_DECIMAL_CURRENCIES.includes(currency) || !showDecimals ? 0 : 2;
  const formattedAmount = numAmount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  // Position symbol before or after amount
  if (SYMBOL_AFTER_AMOUNT.includes(currency)) {
    return `${formattedAmount} ${symbol}`;
  }
  
  return `${symbol}${formattedAmount}`;
};

export const formatCurrencyChange = (amount, currencyCode = 'EUR', showSign = true) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = formatCurrency(Math.abs(numAmount), currencyCode);
  
  if (!showSign) return formatted;
  
  return numAmount >= 0 ? `+${formatted}` : `-${formatted}`;
};


export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') return currencyString;
  
  const cleaned = currencyString.replace(/[^\d.,-]/g, '');
  const normalized = cleaned.replace(/,/g, '');
  
  return parseFloat(normalized) || 0;
};

export default {
  getCurrencySymbol,
  formatCurrency,
  formatCurrencyChange,
  parseCurrency,
  CURRENCY_SYMBOLS,
  SYMBOL_AFTER_AMOUNT,
  NO_DECIMAL_CURRENCIES
};
