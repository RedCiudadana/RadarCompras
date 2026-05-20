import { format } from 'date-fns';

export const formatCurrency = (amount: number, currency = 'GTQ'): string => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('es-GT').format(num);
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
};

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  } catch {
    return 'N/A';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStatusColor = (status?: string): string => {
  if (!status) return 'gray';

  const statusLower = status.toLowerCase();

  if (statusLower.includes('active') || statusLower.includes('activo')) return 'green';
  if (statusLower.includes('complete') || statusLower.includes('completo')) return 'blue';
  if (statusLower.includes('cancelled') || statusLower.includes('cancelado')) return 'red';
  if (statusLower.includes('pending') || statusLower.includes('pendiente')) return 'yellow';

  return 'gray';
};

export const getStatusLabel = (status?: string): string => {
  if (!status) return 'Sin estado';
  return status;
};

export const formatAbbreviatedCurrency = (amount: number, currency = 'GTQ'): string => {
  const million = amount / 1_000_000;
  const billion = amount / 1_000_000_000;

  let value: number;
  let unit: string;

  if (Math.abs(billion) >= 1) {
    value = billion;
    unit = 'B';
  } else if (Math.abs(million) >= 1) {
    value = million;
    unit = 'M';
  } else {
    return formatCurrency(amount, currency);
  }

  const formatted = new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: value < 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted}${unit} ${currency}`;
};
