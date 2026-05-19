export const formatPrice = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value);

  // Crore
  if (numericValue >= 10000000) {
    return `₹ ${(numericValue / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
  }

  // Lakh
  if (numericValue >= 100000) {
    return `₹ ${(numericValue / 100000).toFixed(1).replace(/\.0$/, '')}L`;
  }

  // Below 1 Lakh: use grouped number with currency
  return `₹ ${new Intl.NumberFormat('en-IN').format(numericValue)}`;
};

export const formatPricePerSqft = (value) => {
  if (value === null || value === undefined || value === '') return 'N/A';
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value);

  if (numericValue >= 1000) {
    return `₹ ${(numericValue / 1000).toFixed(1)}K/ sq.ft.`;
  }

  return `₹ ${numericValue.toFixed(2)}/ sq.ft.`;
};

export default { formatPrice, formatPricePerSqft };
