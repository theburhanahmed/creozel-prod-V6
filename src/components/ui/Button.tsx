import React, { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { Loader2Icon } from 'lucide-react';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'neon';
type ButtonSize = 'sm' | 'md' | 'lg';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  as?: React.ElementType;
  to?: string;
  fullWidth?: boolean;
  className?: string;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  loadingText,
  as,
  to,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-opacity-50 transform hover:scale-[0.98] active:scale-95';
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white focus:ring-green-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500 hover:shadow-inner',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500 hover:shadow-inner',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md hover:shadow-lg',
    neon: 'bg-green-500 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] focus:ring-green-500'
  };
  // Disabled styles
  const disabledStyles = 'opacity-50 cursor-not-allowed transform-none hover:scale-100 hover:shadow-none';
  // Full width style
  const widthStyle = fullWidth ? 'w-full' : '';
  // Combine all styles
  const buttonStyles = `
    ${baseStyles} 
    ${sizeStyles[size]} 
    ${variantStyles[variant]} 
    ${disabled || isLoading ? disabledStyles : ''} 
    ${widthStyle}
    ${className}
  `;
  // If we're using a custom component (like Link)
  if (as === Link && to) {
    return <Link to={to} className={buttonStyles}>
      {leftIcon && <span className="mr-2 transform group-hover:scale-110 transition-transform">
        {leftIcon}
      </span>}
      {children}
      {rightIcon && <span className="ml-2 transform group-hover:scale-110 transition-transform">
        {rightIcon}
      </span>}
    </Link>;
  }
  // Standard button
  return <button ref={ref} className={buttonStyles} disabled={disabled || isLoading} {...props}>
    {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
    {!isLoading && leftIcon && <span className="mr-2 transform group-hover:scale-110 transition-transform">
      {leftIcon}
    </span>}
    {isLoading && loadingText ? loadingText : children}
    {!isLoading && rightIcon && <span className="ml-2 transform group-hover:scale-110 transition-transform">
      {rightIcon}
    </span>}
  </button>;
});
Button.displayName = 'Button';