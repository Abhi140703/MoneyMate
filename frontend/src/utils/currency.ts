export const formatCurrency = (amount: number) => {
  const currency = localStorage.getItem('currency') || 'INR';

  const localeMap: Record<string, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    CAD: 'en-CA',
  };

  return new Intl.NumberFormat(
    localeMap[currency] || 'en-IN',
    {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }
  ).format(amount);
};