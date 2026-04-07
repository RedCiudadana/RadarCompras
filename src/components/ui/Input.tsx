import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  variant?: 'filled' | 'outlined';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  variant = 'outlined',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };

  const variantClasses = {
    outlined: `border ${error ? 'border-[rgb(var(--md-sys-color-error))]' : isFocused ? 'border-[rgb(var(--md-sys-color-primary))] border-2' : 'border-[rgb(var(--md-sys-color-outline))]'} rounded-t bg-transparent`,
    filled: `border-b-2 ${error ? 'border-[rgb(var(--md-sys-color-error))]' : isFocused ? 'border-[rgb(var(--md-sys-color-primary))]' : 'border-[rgb(var(--md-sys-color-outline))]'} rounded-t bg-[rgb(var(--md-sys-color-surface-variant))]`,
  };

  return (
    <div className="w-full">
      <div className="relative">
        {label && (
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              isFocused || hasValue
                ? `text-xs ${error ? 'text-[rgb(var(--md-sys-color-error))]' : isFocused ? 'text-[rgb(var(--md-sys-color-primary))]' : 'text-[rgb(var(--md-sys-color-on-surface-variant))]'} ${variant === 'outlined' ? '-top-2 bg-[rgb(var(--md-sys-color-surface))] px-1' : 'top-1'}`
                : 'top-4 text-base text-[rgb(var(--md-sys-color-on-surface-variant))]'
            }`}
          >
            {label}
          </label>
        )}
        {icon && (
          <div className={`absolute ${label ? 'top-1/2 -translate-y-1/2' : 'inset-y-0'} left-3 flex items-center pointer-events-none text-[rgb(var(--md-sys-color-on-surface-variant))]`}>
            {icon}
          </div>
        )}
        <input
          className={`block w-full ${variantClasses[variant]} px-4 ${label ? 'pt-6 pb-2' : 'py-4'} ${
            icon ? 'pl-12' : ''
          } text-[rgb(var(--md-sys-color-on-surface))] placeholder-[rgb(var(--md-sys-color-on-surface-variant))] focus:outline-none transition-all ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1 ml-4 text-xs ${error ? 'text-[rgb(var(--md-sys-color-error))]' : 'text-[rgb(var(--md-sys-color-on-surface-variant))]'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
