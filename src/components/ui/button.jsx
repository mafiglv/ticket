import React from "react";

export function Button({ children, className, ...props }) {
    return (
      <button
        className={`rounded-2xl px-4 py-2 text-white font-semibold shadow-md transition-all ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  