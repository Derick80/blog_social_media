import React from 'react'
import { getCategoryCounts } from '~/utils/categories.server'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'

export type LayoutProps = {
  data: {
    isLoggedIn: boolean
    firstName: string
    userRole: string
    catCount: Awaited<ReturnType<typeof getCategoryCounts>>
    userId: string
    totalPosts: number
    mostPopularPost: {
      title: string
      id: string
    }
  }

  children: React.ReactNode
}

// removed this from the div grid-rows-[(1fr, 200px, 1fr, 1fr)] grid-cols-[(1fr, 2fr, 2fr, 1fr)] grid gap-4
export default function Layout({ data, children }: LayoutProps) {
  // bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500
  return (
    <div className="col-start-1 row-start-1 m-0 gap-4 overflow-scroll p-2 md:col-start-1 md:col-end-6 md:grid md:p-6">
      <div className="col-span-6 col-start-1 row-start-1 row-end-1">
        <NavigationBar data={data} />
      </div>

      <div className="col-span-full col-start-1 row-start-2 h-screen items-center md:col-start-2 md:col-end-6 md:justify-center">
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  )
}
