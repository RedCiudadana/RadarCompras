import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  gradient?: boolean;
  variant?: 'elevated' | 'filled' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
  gradient = false,
  variant = 'elevated',
}) => {
  const variantClasses = {
    elevated: 'bg-[rgb(var(--md-sys-color-surface))] md-elevation-1',
    filled: 'bg-[rgb(var(--md-sys-color-surface-variant))] md-elevation-0',
    outlined: 'bg-[rgb(var(--md-sys-color-surface))] border border-[rgb(var(--md-sys-color-outline-variant))] md-elevation-0',
  };

  const hoverClasses = hover
    ? 'hover:md-elevation-2 transition-all duration-300 cursor-pointer'
    : '';

  const gradientClass = gradient ? 'bg-gradient-to-br from-[rgb(var(--md-sys-color-surface))] to-[rgb(var(--md-sys-color-surface-variant))]' : '';

  return (
    <div
      className={`rounded-xl ${variantClasses[variant]} ${hoverClasses} ${gradientClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`p-4 md:p-6 pb-3 border-b border-[rgb(var(--md-sys-color-outline-variant))] ${className}`}>{children}</div>;
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return <h3 className={`text-xl font-medium text-[rgb(var(--md-sys-color-on-surface))] ${className}`}>{children}</h3>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={`p-4 md:p-6 ${className}`}>{children}</div>;
};
