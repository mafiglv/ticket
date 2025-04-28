import React from "react";

export function Button({ children, className, ...props }) {
  return (
    <button
      className={`rounded-xl px-6 py-3 text-white font-semibold shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
