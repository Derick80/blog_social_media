import React from "react";

export interface IIcon {
  icon: string;
  className?: string;
}

export default function Icon({
  icon,
  className = "material-symbols-outlined md:text-5xl",
}: IIcon) {
  return <div className={className}>{icon}</div>;
}
