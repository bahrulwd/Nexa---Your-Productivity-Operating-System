import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-nexa-purple/40 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-nexa-purple text-white hover:bg-nexa-purple-hover shadow-md shadow-nexa-purple/10 active:scale-[0.98]": variant === 'primary',
          "bg-white/80 hover:bg-white text-nexa-indigo border border-nexa-border shadow-sm active:scale-[0.98]": variant === 'secondary',
          "text-nexa-purple hover:bg-nexa-purple/10": variant === 'ghost',
          "bg-nexa-accent-pink text-white hover:bg-nexa-accent-pink/90 active:scale-[0.98]": variant === 'danger',
        },
        {
          "px-3 py-1.5 text-xs": size === 'sm',
          "px-4 py-2 text-sm": size === 'md',
          "px-6 py-3 text-base": size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
