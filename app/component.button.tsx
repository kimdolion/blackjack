import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode | string;
  disabled?: boolean;
  onClick: () => void;
}

export const Button = ({ children, disabled, onClick }: ButtonProps) => {
  return (
    <button
      className="border p-4 rounded w-1/2"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
