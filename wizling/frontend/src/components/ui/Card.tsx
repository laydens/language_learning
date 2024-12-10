import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card = ({ className = '', children }: CardProps) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = '', children }: CardProps) => (
  <div className={`p-6 pb-3 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ className = '', children }: CardProps) => (
  <div className={`p-6 pt-3 ${className}`}>
    {children}
  </div>
); 