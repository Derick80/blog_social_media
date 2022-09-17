import React from "react";
import Footer from "./footer";
import AdminContainer from "./navbar/admin-container";

export default function Layout({
  children,
  isOwner,
}: {
  children: React.ReactNode;
  isOwner: boolean;
}) {
  return isOwner ? (
    <>

      <AdminContainer isOwner={isOwner}>
        <main tabIndex={-1}>{children}</main>
      </AdminContainer>
      <Footer />
    </>
  ) : (
    <>
      <Footer />
    </>
  );
}

// className='flex flex-col justify-center flex-1 items-center container mt-5 md:mt-12 lg:mt-32'
