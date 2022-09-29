import React from 'react'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'

export type LayoutProps = {
  isLoggedIn: boolean
  children: React.ReactNode
}

export default function Layout({ isLoggedIn, children }: LayoutProps) {
  return (
    <div className="flex flex-col md:flex-row">
      <header className="order-2 space-y-2 px-2 dark:bg-gray-600 md:order-first md:space-y-8 md:py-6 lg:px-4">
        <NavigationBar isLoggedIn={isLoggedIn} />
      </header>
      <main tabIndex={-1} className="container relative mx-auto">
        <div className="container mx-auto mt-2 max-h-screen overflow-scroll md:mt-4">
          {' '}
          {children}
        </div>
      </main>
    </div>
  )
}
