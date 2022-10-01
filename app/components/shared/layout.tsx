import React from 'react'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'

export type LayoutProps = {
  isLoggedIn: boolean
  children: React.ReactNode
}

export default function Layout({ isLoggedIn, children }: LayoutProps) {
  return (
    <div className=''>
    <NavigationBar isLoggedIn={isLoggedIn} />



<main >

 {children}


</main >

</div>
  )
}
