import React from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  onClick?: () => void
  onChange?: () => void
  className?: string
  type: 'button' | 'submit' | 'reset'
  variant?: keyof typeof buttonVariantClasses
}

export const baseButton =
  'flex justify-center items-center px-4 py-2 border text-xs md:text-sm rounded-md'

export const buttonVariantClasses = {
  primary: 'bg-primary',
  outlined: 'border shadow-sm',
  solid_primary: 'bg-green-500',
  solid_danger: 'bg-red-500',
  solid_warning: 'bg-yellow-500',
}

export default function Button({
  onClick,
  className,
  variant = 'solid_primary',
  children,
  type = 'submit',
}: Props) {
  return (
    <button
      className={`${baseButton} ${buttonVariantClasses[variant]} ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
