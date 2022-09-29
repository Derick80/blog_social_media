import React from 'react'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'

export type LayoutProps = {
  isLoggedIn: boolean
  children: React.ReactNode
}

export default function Layout ({ isLoggedIn, children }: LayoutProps) {
  return (
    <div className='flex flex-col md:flex-row'>
    <header className='px-2 lg:px-4 md:py-6 space-y-2 md:space-y-8 order-2 md:order-first dark:bg-gray-600'>
    <NavigationBar isLoggedIn={ isLoggedIn } />
    </header>
      <main tabIndex={ -1 } className='container mx-auto relative'>

        <div className='container mx-auto mt-2 md:mt-4 max-h-screen overflow-scroll'> { children }</div>
      </main>

    </div>
  )
}
