import React from 'react'
import { getCategoryCounts } from '~/utils/categories.server'
import CategoryCount from '../category-count'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'
import Sidebar from '../navbar/sidebar-stats'

export type LayoutProps = {
  data: {
    isLoggedIn: boolean
    firstName: string
    userRole: string
    catCount: Awaited<ReturnType<typeof getCategoryCounts>>
  }

  children: React.ReactNode
}

// removed this from the div grid-rows-[(1fr, 200px, 1fr, 1fr)] grid-cols-[(1fr, 2fr, 2fr, 1fr)] grid gap-4
export default function Layout({ data, children }: LayoutProps) {
  return (
    <>
      <NavigationBar data={data} />

      <div className="flex flex-wrap justify-center text-sm md:text-base">
        {data?.catCount?.map((category) => (
          <CategoryCount key={category.id} category={category} />
        ))}
      </div>

      <div className="col-start-1 col-end-6 row-start-1 m-0 grid gap-4 p-2 md:p-6">{children}</div>
      <Footer />
    </>
  )
}
