
import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
}

const CustomButton = ({
  variant = 'primary',
  className,
  children,
  ...props
}: CustomButtonProps) => {
  return (
    <button
      className={cn(
        variant === 'primary' ? 'cyber-button' : 'cyber-button-alt',
        "relative transition-all duration-300 group",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Glow effect layer */}
      <span className={cn(
        "absolute inset-0 blur-md opacity-0 transition-opacity duration-300 -z-1",
        variant === 'primary' 
          ? "bg-gradient-to-r from-cyber-purple to-cyber-purple-light" 
          : "bg-gradient-to-r from-cyber-blue to-cyber-blue-light",
        "group-hover:opacity-30 group-active:opacity-50"
      )}></span>
      
      {/* Background grid pattern */}
      <span className="absolute inset-0 bg-cyber-grid bg-[size:10px_10px] opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-2"></span>
    </button>
  );
};

export default CustomButton;
