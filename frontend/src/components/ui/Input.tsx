import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-nexa-indigo/80 tracking-wide">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2.5 bg-white/70 text-nexa-navy border border-nexa-border rounded-xl transition-all duration-200 placeholder:text-gray-400 outline-none focus:bg-white focus:border-nexa-purple focus:ring-4 focus:ring-nexa-purple/10 text-sm",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-nexa-indigo/80 tracking-wide">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "w-full px-4 py-2.5 bg-white/70 text-nexa-navy border border-nexa-border rounded-xl transition-all duration-200 placeholder:text-gray-400 outline-none focus:bg-white focus:border-nexa-purple focus:ring-4 focus:ring-nexa-purple/10 text-sm min-h-[80px] resize-none",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
