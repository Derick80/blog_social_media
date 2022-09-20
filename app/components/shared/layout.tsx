import React from 'react'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'

export type LayoutProps = {
  isLoggedIn: boolean
  children: React.ReactNode
}

export default function Layout({ isLoggedIn, children }: LayoutProps) {
  return (
    <>
      <main tabIndex={-1}>
        <NavigationBar isLoggedIn={isLoggedIn} />
        {children}
      </main>
      <Footer />
    </>
  )
}
