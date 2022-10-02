import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { getHeroPost, getPosts } from '~/utils/post.server'
import PostPreview from '~/components/post-preview'
import { getCategoryCounts } from '~/utils/categories.server'
import CategoryCount from '~/components/category-count'
import { QueriedPost, QueriedUser } from '~/utils/types.server'
import Sidebar from '~/components/navbar/sidebar'
import { getHighestField, getTotalPosts } from '~/utils/functions.server'
import { getLikeCounts } from '~/utils/like.server'

type LoaderData = {
  userPosts: QueriedPost[]
  catCount: Awaited<ReturnType<typeof getCategoryCounts>>
  isOwner: boolean
  isLoggedIn: boolean
  currentUser: string
  user?: QueriedUser
  firstName: string
  userRole: string
  userId: string
  heroPost: QueriedPost[]
  totalPosts: number
}
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

  const { heroPost } = await getHeroPost()
  if (!userPosts) {
    throw new Response(`No posts found`, {
      status: 404,
    })
  }

  const data: LoaderData = {
    userId,
    userRole,

    userPosts,
    catCount,
    isOwner,
    isLoggedIn,
    currentUser,
    firstName,
    heroPost,
    totalPosts,
  }
  return json(data)
}

export default function Home() {
  const data = useLoaderData<LoaderData>()

  return (
    <div className="col-start-2 col-end-6 m-0 grid gap-4 p-2 md:p-6">
      {/* <div className="justify-center flex-wrap md:flex-col min-w-fit text-sm md:text-base">

        {data?.catCount.map((category) => (
          <CategoryCount key={category.id} category={category} />
        ))}
      </div> */}
      <div className="hidden h-full md:grid">
        <div className="flex min-w-fit justify-between text-sm md:flex-col md:text-base">
          <div>
            {data?.catCount.map((category) => (
              <CategoryCount key={category.id} category={category} />
            ))}
          </div>
          <div className="flex">
            <Sidebar
              isLoggedIn={data.isLoggedIn}
              userRole={data.userRole}
              firstName={data.firstName}
            />
          </div>
        </div>
      </div>
      <div className="col-start-2 col-end-4 justify-center gap-4 md:flex">
        {data.userPosts.map((post) => (
          <PostPreview
            key={post.id}
            post={post}
            currentUser={data.userId}
            isLoggedin={data.isLoggedIn}
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
