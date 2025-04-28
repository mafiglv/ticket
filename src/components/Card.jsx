import React from "react";

export function Card({ children, className }) {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`${className}`}>{children}</div>;
}
