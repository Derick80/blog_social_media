import React from 'react'
import { getCategoryCounts } from '~/utils/categories.server'
import CategoryCount from '../category-count'
import Footer from '../footer'
import NavigationBar from '../navbar/primary-nav'
import Sidebar from '../navbar/sidebar'

export type LayoutProps = {
  data: {
    isLoggedIn: boolean
    firstName: string
    userRole: string
    catCount: Awaited<ReturnType<typeof getCategoryCounts>>
  }

  children: React.ReactNode
}

export default function Layout({ data, children }: LayoutProps) {
  return (
    <div className="grid-rows-[(1fr, 200px, 1fr, 1fr)] grid-cols-[(56px, _2fr, _2fr, _1fr)] grid gap-4">
      <NavigationBar data={data} />

      <div className="col-start-2 col-end-3 row-start-2 flex flex-wrap justify-center text-sm md:text-base">
        {data?.catCount?.map((category) => (
          <CategoryCount key={category.id} category={category} />
        ))}
      </div>

      <div className="col-start-2 col-end-3 row-start-3">{children}</div>
      <Footer />
    </div>
  )
}
