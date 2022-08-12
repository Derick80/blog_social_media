import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-full gap-1 md:gap-3 md:grid-cols-12 text-black  dark:text-white">
      {children}
    </div>
  );
}
