import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  onChange?: () => void;
  className?: string;
  type: "button" | "submit" | "reset";
  variant?: keyof typeof buttonVariantClasses

}

export const baseButton = 'inline-flex justify-center items-center px-4 py-2 border text-sm rounded-md'

export const buttonVariantClasses={
outlined: "border shadow-sm ",
solid: "bg-red"
}

export default function Button({
  onClick,
  className,
  children,
  type = "submit",

}: Props) {
  return (
    <button
className={`${baseButton} ${buttonVariantClasses.outlined} ${className}`}
    type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
