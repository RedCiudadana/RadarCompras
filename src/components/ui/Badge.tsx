import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'info' | 'error' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-[rgb(var(--md-sys-color-surface-variant))] text-[rgb(var(--md-sys-color-on-surface-variant))]',
    success: 'bg-green-100 text-green-900',
    info: 'bg-[rgb(var(--md-sys-color-primary-container))] text-[rgb(var(--md-sys-color-on-primary-container))]',
    error: 'bg-red-100 text-red-900',
    warning: 'bg-amber-100 text-amber-900',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium md-elevation-0 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
