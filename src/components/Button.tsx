import * as React from "react";

export interface IButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Button({ children, onClick, className = "" }: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md
        hover:bg-gray-700
        focus:outline-none focus:ring-0 active:outline-none active:ring-0
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}
