import type { ReactNode } from "react";

export interface IContent {
  children?: ReactNode;
}

export default function ContentContainer({ children }: IContent) {
  return <div className="w-full flex flex-col items-center">{children}</div>;
}
