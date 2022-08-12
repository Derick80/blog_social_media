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
  type?: string;
  props?: unknown;
}

export default function Button({
  defaultValue,
  onClick,
  className = "flex flex-row items-end" +
    " rounded-xl bg-green-400 font-semibold justify-items-center text-white-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1",
  children,
  type,
  ...props
}: Props) {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
