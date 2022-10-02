import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { getHeroPost, getMostPopularPost, getPost, getPosts } from '~/utils/post.server'
import PostPreview from '~/components/post-preview'
import { getCategoryCounts } from '~/utils/categories.server'
import CategoryCount from '~/components/category-count'
import { QueriedPost, QueriedUser } from '~/utils/types.server'
import Sidebar from '~/components/navbar/sidebar-stats'
import { getHighestField, getTotalPosts } from '~/utils/functions.server'
import { getLikeCounts } from '~/utils/like.server'
import SidebarContainer from '~/components/navbar/sidebar-container'

type LoaderData = {
  userPosts: QueriedPost[]
  mostPopularPost: {
    title: string
    id: string
  }
  catCount: Awaited<ReturnType<typeof getCategoryCounts>>
  isOwner: boolean
  isLoggedIn: boolean
  currentUser: string
  user: QueriedUser
  firstName: string
  userRole: string
  userId: string
  totalPosts: number
  heroPost: Awaited<typeof getHeroPost> | QueriedPost[]
}

type StatsLoader = Partial<LoaderData>
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const userId = user?.id as string

  const isLoggedIn = user?.role === 'ADMIN' || user?.role === 'USER' ? true : false
  const currentUser = user?.id as string
  const isOwner = user?.role === 'ADMIN'
  const firstName = user?.firstName as string
  const userRole = user?.role as string

  const { userPosts } = await getPosts()
  const catCount = await getCategoryCounts()

  const totalPosts = getTotalPosts(userPosts)
  const maxLikes = await getLikeCounts()
  const mostPopularPostId = maxLikes._max?.postId as string
  const mostPopularPost = await getMostPopularPost({ id: mostPopularPostId })

  const { heroPost } = await getHeroPost()
  if (!userPosts || !heroPost || !user) {
    throw new Response(`Missing one of 4 requests`, {
      status: 404,
    })
  }
  if (!mostPopularPost) {
    throw new Response(`Missing one of 4 requests`, {
      status: 404,
    })
  }

  const data: LoaderData = {
    totalPosts,
    mostPopularPost,
    heroPost,
    userId,
    userRole,
    userPosts,
    user,
    catCount,
    isOwner,
    isLoggedIn,
    currentUser,
    firstName,
  }
  return json(data)
}

export default function Home() {
  const data = useLoaderData<LoaderData>()
  const {
    mostPopularPost,
    heroPost,
    userPosts,
    catCount,
    isOwner,
    isLoggedIn,
    currentUser,
    firstName,
    totalPosts,
    userRole,
    userId,
  } = data
  console.log('data', data)

  return (
    <div className="col-start-2 col-end-6 m-0 grid gap-4 p-2 md:p-6">
      <div className="hidden min-w-fit flex-col justify-between text-sm md:flex md:flex-col md:text-base">
        <svg strokeWidth="3" className="text-slate-400">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <SidebarContainer
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          firstName={firstName}
          userId={userId}
          totalPosts={totalPosts}
          mostPopularPost={mostPopularPost}
        />
      </div>
      <div className="col-start-2 col-end-4 justify-center gap-4 md:flex">
        {userPosts.map((post) => (
          <PostPreview key={post.id} post={post} currentUser={userId} isLoggedin={isLoggedIn} />
        ))}
      </div>
      <div className="flex min-w-fit flex-row flex-wrap text-sm md:flex-col md:text-base"></div>
    </div>
  )
}

export function ErrorBoundary() {
  return <div>Sorry, something went wrong! :/ Please try again later.</div>
}
