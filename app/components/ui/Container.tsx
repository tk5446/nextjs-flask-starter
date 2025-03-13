'use client';

import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#f8fafc] transition-all duration-150 ease-in-out ${className}`}>
      {children}
    </div>
  );
}
