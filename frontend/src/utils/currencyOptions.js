
export const CURRENCY_OPTIONS = [
  // Europe
  { value: 'EUR', label: '€ EUR - Euro', region: 'Europe' },
  { value: 'GBP', label: '£ GBP - British Pound', region: 'Europe' },
  { value: 'CHF', label: 'CHF - Swiss Franc', region: 'Europe' },
  { value: 'SEK', label: 'kr SEK - Swedish Krona', region: 'Europe' },
  { value: 'NOK', label: 'kr NOK - Norwegian Krone', region: 'Europe' },
  { value: 'DKK', label: 'kr DKK - Danish Krone', region: 'Europe' },
  
  // Eastern Europe
  { value: 'RON', label: 'lei RON - Romanian Leu', region: 'Eastern Europe' },
  { value: 'PLN', label: 'zł PLN - Polish Złoty', region: 'Eastern Europe' },
  { value: 'CZK', label: 'Kč CZK - Czech Koruna', region: 'Eastern Europe' },
  { value: 'HUF', label: 'Ft HUF - Hungarian Forint', region: 'Eastern Europe' },
  { value: 'BGN', label: 'лв BGN - Bulgarian Lev', region: 'Eastern Europe' },
  { value: 'RUB', label: '₽ RUB - Russian Ruble', region: 'Eastern Europe' },
  
  // Americas
  { value: 'USD', label: '$ USD - US Dollar', region: 'Americas' },
  { value: 'CAD', label: 'C$ CAD - Canadian Dollar', region: 'Americas' },
  { value: 'BRL', label: 'R$ BRL - Brazilian Real', region: 'Americas' },
  { value: 'MXN', label: 'MX$ MXN - Mexican Peso', region: 'Americas' },
  
  // Asia
  { value: 'JPY', label: '¥ JPY - Japanese Yen', region: 'Asia' },
  { value: 'CNY', label: '¥ CNY - Chinese Yuan', region: 'Asia' },
  { value: 'INR', label: '₹ INR - Indian Rupee', region: 'Asia' },
  { value: 'KRW', label: '₩ KRW - South Korean Won', region: 'Asia' },
  { value: 'SGD', label: 'S$ SGD - Singapore Dollar', region: 'Asia' },
  { value: 'HKD', label: 'HK$ HKD - Hong Kong Dollar', region: 'Asia' },
  { value: 'THB', label: '฿ THB - Thai Baht', region: 'Asia' },
  { value: 'MYR', label: 'RM MYR - Malaysian Ringgit', region: 'Asia' },
  { value: 'IDR', label: 'Rp IDR - Indonesian Rupiah', region: 'Asia' },
  { value: 'PHP', label: '₱ PHP - Philippine Peso', region: 'Asia' },
  { value: 'VND', label: '₫ VND - Vietnamese Dong', region: 'Asia' },
  
  // Oceania
  { value: 'AUD', label: 'A$ AUD - Australian Dollar', region: 'Oceania' },
  { value: 'NZD', label: 'NZ$ NZD - New Zealand Dollar', region: 'Oceania' },
  
  // Middle East & Africa
  { value: 'AED', label: 'د.إ AED - UAE Dirham', region: 'Middle East' },
  { value: 'SAR', label: 'SR SAR - Saudi Riyal', region: 'Middle East' },
  { value: 'TRY', label: '₺ TRY - Turkish Lira', region: 'Middle East' },
  { value: 'EGP', label: 'E£ EGP - Egyptian Pound', region: 'Africa' },
  { value: 'ZAR', label: 'R ZAR - South African Rand', region: 'Africa' },
];


export const getCurrencyOptionsByRegion = () => {
  const grouped = {};
  
  CURRENCY_OPTIONS.forEach(option => {
    if (!grouped[option.region]) {
      grouped[option.region] = [];
    }
    grouped[option.region].push(option);
  });
  
  return grouped;
};


export const COMMON_CURRENCIES = [
  { value: 'EUR', label: '€ EUR - Euro' },
  { value: 'USD', label: '$ USD - US Dollar' },
  { value: 'GBP', label: '£ GBP - British Pound' },
  { value: 'JPY', label: '¥ JPY - Japanese Yen' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'CAD', label: 'C$ CAD - Canadian Dollar' },
  { value: 'AUD', label: 'A$ AUD - Australian Dollar' },
  { value: 'CNY', label: '¥ CNY - Chinese Yuan' },
];

export default CURRENCY_OPTIONS;
