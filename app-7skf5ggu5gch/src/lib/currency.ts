export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const formatCurrencyWhole = (amount: number): string => {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};
