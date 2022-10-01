import React from 'react'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'

export type LayoutProps = {
  isLoggedIn: boolean
  children: React.ReactNode
}

export default function Layout({ isLoggedIn, children }: LayoutProps) {
  return (
    <div className="p-2 md:p-4">
      <NavigationBar isLoggedIn={isLoggedIn} />

      <main>{children}</main>
    </div>
  )
}
