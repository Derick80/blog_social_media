import React from 'react'
import Footer from './footer'
import AdminContainer from './navbar/admin-container'
import ContentContainer from './navbar/content-container'

export default function Layout({
  children,
  isOwner
}: {
  children: React.ReactNode
  isOwner: boolean
}) {
  return isOwner ? (
    <>
      {' '}
      <AdminContainer isOwner={isOwner}>

      <main className='flex flex-col flex-1 items-center container mt-5 md:mt-12 lg:mt-32' tabIndex={-1}>
      {children}
      </main>

      </AdminContainer>
      <Footer/>
    </>

  ) : (
    <>
      <ContentContainer>{children}</ContentContainer>
      <Footer/>

    </>
  )
}
