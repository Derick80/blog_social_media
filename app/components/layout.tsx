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
      <AdminContainer isOwner={isOwner}>{children}

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
