
import React from 'react';
import { cn } from '@/lib/utils';

interface CalcButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const CalcButton: React.FC<CalcButtonProps> = ({ 
  children, 
  className, 
  ...props 
}) => {
  return (
    <button 
      className={cn("calc-btn", className)}
      {...props}
    >
      {children}
    </button>
  );
};
