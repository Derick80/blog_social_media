import React from "react";

interface Props {
  defaultValue?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  onChange?: () => void;
  className?: string;
  id?: string;
  role?: string;
  name?: string;
  value?: string;
  type: "button" | "submit" | "reset";
  props?: unknown;
}

export default function Button({
  defaultValue,
  onClick,
  className,
  children,
  type = "submit",
  name,
  value,
  ...props
}: Props) {
  return (
    <button
      className={className}
      name={name}
      type={type}
      onClick={onClick}
      value={value}
    >
      {children}
    </button>
  );
}
