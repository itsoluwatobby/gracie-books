import React, { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-950 focus:ring-blue-700 disabled:bg-blue-300',
    secondary: 'bg-blue-100 text-blue-900 hover:bg-blue-200 active:bg-blue-300 focus:ring-blue-400 disabled:bg-blue-50 disabled:text-blue-300',
    outline: 'border border-blue-900 text-blue-900 bg-transparent hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-400 disabled:border-blue-200 disabled:text-blue-200',
    ghost: 'text-blue-900 bg-transparent hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-400 disabled:text-blue-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 disabled:bg-red-300'
  };
  
  // Loading state
  const loadingClasses = isLoading ? 'relative text-transparent' : '';
  
  // Full width
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled state
  const isDisabled = disabled || isLoading;
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${loadingClasses}
    ${widthClasses}
    ${className}
  `;
  
  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}
    </button>
  );
};

export default Button;