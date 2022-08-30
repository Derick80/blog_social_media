import React from 'react'

export interface IIcon {
  icon: string;
  className?: string;
}

export default function Icon({
  icon,
  className,
}: IIcon) {
  return <div className={`${className} material-symbols-outlined md:text-5xl`}>{icon}</div>;
}
