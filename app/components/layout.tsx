import React from "react";
import Footer from "./footer";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return  (
    <>
        <main  tabIndex={-1}>{children}</main>
      <Footer />

    </>
  );
}

// className='flex flex-col justify-center flex-1 items-center container mt-5 md:mt-12 lg:mt-32'
