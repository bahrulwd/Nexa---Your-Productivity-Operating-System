import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border uppercase",
        {
          "bg-emerald-500/10 text-emerald-600 border-emerald-500/20": variant === 'success',
          "bg-amber-500/10 text-amber-600 border-amber-500/20": variant === 'warning',
          "bg-red-500/10 text-red-600 border-red-500/20": variant === 'error',
          "bg-nexa-purple/10 text-nexa-purple border-nexa-purple/20": variant === 'info',
          "bg-nexa-indigo/10 text-nexa-indigo/80 border-nexa-indigo/20": variant === 'neutral',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
export default Badge;
