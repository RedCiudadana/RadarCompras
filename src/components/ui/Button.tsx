import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium uppercase tracking-wide transition-all duration-200 focus:outline-none disabled:opacity-38 disabled:cursor-not-allowed relative overflow-hidden';

  const variantClasses = {
    filled: 'bg-[rgb(var(--md-sys-color-primary))] text-[rgb(var(--md-sys-color-on-primary))] md-elevation-0 hover:md-elevation-1 active:md-elevation-0 rounded-full',
    elevated: 'bg-[rgb(var(--md-sys-color-surface))] text-[rgb(var(--md-sys-color-primary))] md-elevation-1 hover:md-elevation-2 active:md-elevation-1 rounded-full',
    tonal: 'bg-[rgb(var(--md-sys-color-secondary-container))] text-[rgb(var(--md-sys-color-on-secondary-container))] md-elevation-0 hover:md-elevation-1 active:md-elevation-0 rounded-full',
    outlined: 'border border-[rgb(var(--md-sys-color-outline))] text-[rgb(var(--md-sys-color-primary))] hover:bg-[rgb(var(--md-sys-color-primary))]/8 active:bg-[rgb(var(--md-sys-color-primary))]/12 rounded-full',
    text: 'text-[rgb(var(--md-sys-color-primary))] hover:bg-[rgb(var(--md-sys-color-primary))]/8 active:bg-[rgb(var(--md-sys-color-primary))]/12 rounded-full',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs min-h-[32px]',
    md: 'px-6 py-2.5 text-sm min-h-[40px]',
    lg: 'px-8 py-3 text-base min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};
