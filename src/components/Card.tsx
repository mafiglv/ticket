import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={`${className}`}>{children}</div>;
}
