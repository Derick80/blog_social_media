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
import HeroPost from '~/components/hero-post-preview'

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
  const userRole = user?.role as string
  const isLoggedIn = user === null ? false : true

  const currentUser = user?.id as string
  const isOwner = user?.role === 'ADMIN'
  const firstName = user?.firstName as string

  const { userPosts } = await getPosts()
  const catCount = await getCategoryCounts()

  const totalPosts = getTotalPosts(userPosts)
  const maxLikes = await getLikeCounts()
  const mostPopularPostId = maxLikes._max?.postId as string
  const mostPopularPost = await getMostPopularPost({ id: mostPopularPostId })

  const { heroPost } = await getHeroPost()
  console.log('isloggedin __app index route', isLoggedIn)
  console.log(userRole)
  console.log('curreent user at __ app index route', currentUser)

  if (!userPosts || !heroPost) {
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

  return (
    <div className="grid grid-cols-1 grid-rows-1 justify-center gap-4 p-2 md:grid-cols-6 md:grid-rows-none md:gap-8 md:p-4">
      <div className="col-span-full col-start-1 mb-2 justify-center md:col-start-2 md:col-end-6 md:row-end-1 md:mb-2 md:flex-wrap">
        <div className="flex flex-wrap justify-center pb-2 text-sm md:pb-4 md:text-base">
          {data?.catCount?.map((category) => (
            <CategoryCount key={category.id} category={category} />
          ))}
        </div>

        <div></div>
      </div>
      <div className="col-span-full gap-4">
        <div>
          {' '}
          {heroPost?.map((post) => (
            <HeroPost key={post.id} post={post} isLoggedin={isLoggedIn} />
          ))}
        </div>
      </div>
      <div className="colums-2 col-span-full flex flex-wrap justify-around gap-4">
        {data?.userPosts?.map((post) => (
          <PostPreview
            key={post.id}
            post={post}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
          />
        ))}
      </div>
      <div className="flex min-w-fit flex-row flex-wrap text-sm md:flex-col md:text-base"></div>
    </div>
  )
}

export function ErrorBoundary() {
  return <div>Sorry, something went wrong! :/ Please try again later.</div>
}
