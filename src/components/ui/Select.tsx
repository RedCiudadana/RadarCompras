import React, { useState } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  variant?: 'filled' | 'outlined';
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  variant = 'outlined',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    setHasValue(!!e.target.value);
    props.onBlur?.(e);
  };

  const variantClasses = {
    outlined: `border ${isFocused ? 'border-[rgb(var(--md-sys-color-primary))] border-2' : 'border-[rgb(var(--md-sys-color-outline))]'} rounded-t bg-transparent`,
    filled: `border-b-2 ${isFocused ? 'border-[rgb(var(--md-sys-color-primary))]' : 'border-[rgb(var(--md-sys-color-outline))]'} rounded-t bg-[rgb(var(--md-sys-color-surface-variant))]`,
  };

  return (
    <div className="w-full">
      <div className="relative">
        {label && (
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
              isFocused || hasValue
                ? `text-xs ${isFocused ? 'text-[rgb(var(--md-sys-color-primary))]' : 'text-[rgb(var(--md-sys-color-on-surface-variant))]'} ${variant === 'outlined' ? '-top-2 bg-[rgb(var(--md-sys-color-surface))] px-1' : 'top-1'}`
                : 'top-4 text-base text-[rgb(var(--md-sys-color-on-surface-variant))]'
            }`}
          >
            {label}
          </label>
        )}
        <select
          className={`block w-full ${variantClasses[variant]} px-4 ${label ? 'pt-6 pb-2' : 'py-4'} text-[rgb(var(--md-sys-color-on-surface))] focus:outline-none transition-all appearance-none ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            setHasValue(!!e.target.value);
            props.onChange?.(e);
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-[rgb(var(--md-sys-color-on-surface-variant))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
