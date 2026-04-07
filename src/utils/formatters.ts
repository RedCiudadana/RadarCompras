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
