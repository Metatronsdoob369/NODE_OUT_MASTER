import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'bioluminescent';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', type, ...props }, ref) => {
    const variants = {
      default: "border-input bg-background",
      glass: "border-white/20 bg-white/5 text-white placeholder:text-white/60",
      bioluminescent: "border-emerald-500/30 bg-emerald-900/10 text-emerald-50 placeholder:text-emerald-300/60 focus:border-emerald-400 focus:ring-emerald-400/20"
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glass' | 'bioluminescent';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "border-input bg-background",
      glass: "border-white/20 bg-white/5 text-white placeholder:text-white/60",
      bioluminescent: "border-emerald-500/30 bg-emerald-900/10 text-emerald-50 placeholder:text-emerald-300/60 focus:border-emerald-400 focus:ring-emerald-400/20"
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={cn("text-sm font-medium text-slate-300 mb-1 block", className)}
        ref={ref}
        {...props}
      />
    );
  }
);

InputLabel.displayName = "InputLabel";

export { Input, Textarea, InputLabel };