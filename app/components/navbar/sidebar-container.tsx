import { QueriedPost } from '~/utils/types.server'
import SideBarStats from './sidebar-stats'
import SidebarNav from './sidebar-nav'

export interface SidebarContainerProps {
    isLoggedIn: boolean
    firstName: string
    userRole: string
    userId: string

    totalPosts: number
    mostPopularPost: QueriedPost
}

export default function SidebarContainer({  isLoggedIn, firstName, userRole, userId, totalPosts, mostPopularPost }:SidebarContainerProps) {
  return (
  <>

 <SideBarStats
 totalPosts={totalPosts}
 mostPopularPost={mostPopularPost}
 />
  <SidebarNav
  isLoggedIn={isLoggedIn}
  userRole={userRole}
  firstName={firstName}
  userId={userId}

 />
  </>
  )
}
