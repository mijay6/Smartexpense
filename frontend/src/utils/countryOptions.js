// Country options with ISO codes (value) and full names (label)
export const COUNTRY_OPTIONS = [
  // Europe
  { value: 'AT', label: '🇦🇹 Austria', name: 'Austria', region: 'Europe' },
  { value: 'BE', label: '🇧🇪 Belgium', name: 'Belgium', region: 'Europe' },
  { value: 'BG', label: '🇧🇬 Bulgaria', name: 'Bulgaria', region: 'Europe' },
  { value: 'HR', label: '🇭🇷 Croatia', name: 'Croatia', region: 'Europe' },
  { value: 'CY', label: '🇨🇾 Cyprus', name: 'Cyprus', region: 'Europe' },
  { value: 'CZ', label: '🇨🇿 Czech Republic', name: 'Czech Republic', region: 'Europe' },
  { value: 'DK', label: '🇩🇰 Denmark', name: 'Denmark', region: 'Europe' },
  { value: 'EE', label: '🇪🇪 Estonia', name: 'Estonia', region: 'Europe' },
  { value: 'FI', label: '🇫🇮 Finland', name: 'Finland', region: 'Europe' },
  { value: 'FR', label: '🇫🇷 France', name: 'France', region: 'Europe' },
  { value: 'DE', label: '🇩🇪 Germany', name: 'Germany', region: 'Europe' },
  { value: 'GR', label: '🇬🇷 Greece', name: 'Greece', region: 'Europe' },
  { value: 'HU', label: '🇭🇺 Hungary', name: 'Hungary', region: 'Europe' },
  { value: 'IE', label: '🇮🇪 Ireland', name: 'Ireland', region: 'Europe' },
  { value: 'IT', label: '🇮🇹 Italy', name: 'Italy', region: 'Europe' },
  { value: 'LV', label: '🇱🇻 Latvia', name: 'Latvia', region: 'Europe' },
  { value: 'LT', label: '🇱🇹 Lithuania', name: 'Lithuania', region: 'Europe' },
  { value: 'LU', label: '🇱🇺 Luxembourg', name: 'Luxembourg', region: 'Europe' },
  { value: 'MT', label: '🇲🇹 Malta', name: 'Malta', region: 'Europe' },
  { value: 'NL', label: '🇳🇱 Netherlands', name: 'Netherlands', region: 'Europe' },
  { value: 'NO', label: '🇳🇴 Norway', name: 'Norway', region: 'Europe' },
  { value: 'PL', label: '🇵🇱 Poland', name: 'Poland', region: 'Europe' },
  { value: 'PT', label: '🇵🇹 Portugal', name: 'Portugal', region: 'Europe' },
  { value: 'RO', label: '🇷🇴 Romania', name: 'Romania', region: 'Europe' },
  { value: 'SK', label: '🇸🇰 Slovakia', name: 'Slovakia', region: 'Europe' },
  { value: 'SI', label: '🇸🇮 Slovenia', name: 'Slovenia', region: 'Europe' },
  { value: 'ES', label: '🇪🇸 Spain', name: 'Spain', region: 'Europe' },
  { value: 'SE', label: '🇸🇪 Sweden', name: 'Sweden', region: 'Europe' },
  { value: 'CH', label: '🇨🇭 Switzerland', name: 'Switzerland', region: 'Europe' },
  { value: 'GB', label: '🇬🇧 United Kingdom', name: 'United Kingdom', region: 'Europe' },

  // Americas
  { value: 'US', label: '🇺🇸 United States', name: 'United States', region: 'Americas' },
  { value: 'CA', label: '🇨🇦 Canada', name: 'Canada', region: 'Americas' },
  { value: 'MX', label: '🇲🇽 Mexico', name: 'Mexico', region: 'Americas' },
  { value: 'BR', label: '🇧🇷 Brazil', name: 'Brazil', region: 'Americas' },
  { value: 'AR', label: '🇦🇷 Argentina', name: 'Argentina', region: 'Americas' },
  { value: 'CL', label: '🇨🇱 Chile', name: 'Chile', region: 'Americas' },
  { value: 'CO', label: '🇨🇴 Colombia', name: 'Colombia', region: 'Americas' },
  { value: 'PE', label: '🇵🇪 Peru', name: 'Peru', region: 'Americas' },

  // Asia
  { value: 'CN', label: '🇨🇳 China', name: 'China', region: 'Asia' },
  { value: 'IN', label: '🇮🇳 India', name: 'India', region: 'Asia' },
  { value: 'JP', label: '🇯🇵 Japan', name: 'Japan', region: 'Asia' },
  { value: 'KR', label: '🇰🇷 South Korea', name: 'South Korea', region: 'Asia' },
  { value: 'SG', label: '🇸🇬 Singapore', name: 'Singapore', region: 'Asia' },
  { value: 'TH', label: '🇹🇭 Thailand', name: 'Thailand', region: 'Asia' },
  { value: 'VN', label: '🇻🇳 Vietnam', name: 'Vietnam', region: 'Asia' },
  { value: 'MY', label: '🇲🇾 Malaysia', name: 'Malaysia', region: 'Asia' },
  { value: 'ID', label: '🇮🇩 Indonesia', name: 'Indonesia', region: 'Asia' },
  { value: 'PH', label: '🇵🇭 Philippines', name: 'Philippines', region: 'Asia' },
  { value: 'HK', label: '🇭🇰 Hong Kong', name: 'Hong Kong', region: 'Asia' },

  // Oceania
  { value: 'AU', label: '🇦🇺 Australia', name: 'Australia', region: 'Oceania' },
  { value: 'NZ', label: '🇳🇿 New Zealand', name: 'New Zealand', region: 'Oceania' },

  // Middle East & Africa
  { value: 'AE', label: '🇦🇪 United Arab Emirates', name: 'United Arab Emirates', region: 'Middle East' },
  { value: 'SA', label: '🇸🇦 Saudi Arabia', name: 'Saudi Arabia', region: 'Middle East' },
  { value: 'TR', label: '🇹🇷 Turkey', name: 'Turkey', region: 'Middle East' },
  { value: 'EG', label: '🇪🇬 Egypt', name: 'Egypt', region: 'Africa' },
  { value: 'ZA', label: '🇿🇦 South Africa', name: 'South Africa', region: 'Africa' },
];

// Helper function to get country name from code
export const getCountryName = (code) => {
  const country = COUNTRY_OPTIONS.find(c => c.value === code);
  return country ? country.name : code;
};

// Helper function to get country label with flag from code
export const getCountryLabel = (code) => {
  const country = COUNTRY_OPTIONS.find(c => c.value === code);
  return country ? country.label : code;
};

export const COMMON_COUNTRIES = [
  { value: 'US', label: '🇺🇸 United States' },
  { value: 'GB', label: '🇬🇧 United Kingdom' },
  { value: 'DE', label: '🇩🇪 Germany' },
  { value: 'FR', label: '🇫🇷 France' },
  { value: 'ES', label: '🇪🇸 Spain' },
  { value: 'IT', label: '🇮🇹 Italy' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'CN', label: '🇨🇳 China' },
];

export default COUNTRY_OPTIONS;
