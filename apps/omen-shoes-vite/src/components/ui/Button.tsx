import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'brand';
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseClasses =
    'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring focus-visible:ring-offset-2';
  const variantClasses: Record<string, string> = {
    primary: 'bg-[#111] text-white hover:bg-[#111]/90 disabled:opacity-50',
    secondary: 'bg-white text-[#111] border border-[#d4ccc6] hover:bg-[#f0ebe7] disabled:opacity-50',
    brand: 'bg-[#1d4ed8] text-white hover:bg-[#1d4ed8]/90 disabled:opacity-50',
  };
  const glassClass = 'bg-white/30 backdrop-blur-md rounded-lg border border-white/20';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${glassClass} ${className}`.trim()}
    >
      {children}
    </button>
  );
};

export default Button;
