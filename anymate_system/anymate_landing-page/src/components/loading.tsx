import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'spinner' | 'pulse';
  text?: string;
}

const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size = 'md', variant = 'default', text, ...props }, ref) => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6', 
      lg: 'w-8 h-8'
    };

    const variants = {
      default: (
        <div className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizes[size])} />
      ),
      dots: (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-current rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      ),
      pulse: (
        <div className={cn("bg-current rounded-full animate-pulse", sizes[size])} />
      ),
      spinner: (
        <div className={cn("relative", sizes[size])}>
          <div className="absolute inset-0 rounded-full border-2 border-gray-300" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
        </div>
      )
    };

    return (
      <div
        className={cn("flex flex-col items-center justify-center space-y-2", className)}
        ref={ref}
        {...props}
      >
        {variants[variant]}
        {text && (
          <p className="text-sm text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    );
  }
);

Loading.displayName = "Loading";

export { Loading };