import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import Layout from '~/components/shared/layout'
import { getUser } from '~/utils/auth.server'
import { getCategoryCounts } from '~/utils/categories.server'
import { getTotalPosts } from '~/utils/functions.server'
import { getLikeCounts } from '~/utils/like.server'
import { getPosts,getMostPopularPost } from '~/utils/post.server'
import { QueriedUser } from '~/utils/types.server'

export const meta: MetaFunction = () => ({
  title: `Derick's Personal Blog Feed`,
  description: `See what I've been up to lately`,
})
type LoaderData = {
  mostPopularPost: {
    title: string
    id: string
  }
  totalPosts: number
  isLoggedIn: boolean
  firstName: string
  userRole: string
  catCount: Awaited<ReturnType<typeof getCategoryCounts>>
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isLoggedIn = user === null ? false : true
  const firstName = user?.firstName as string
  const userRole = user?.role as string
  const catCount = await getCategoryCounts()
  const { userPosts } = await getPosts()

  const totalPosts = getTotalPosts(userPosts)
  const maxLikes = await getLikeCounts()

  const mostPopularPostId = maxLikes._max?.postId as string
  const mostPopularPost = await getMostPopularPost({ id: mostPopularPostId })
  console.log('isloggedin __ap', isLoggedIn)
  if (!mostPopularPost) {
    throw new Response(`Missing one of 4 requests`, {
      status: 404,
    })
  }

  const data: LoaderData = {
    isLoggedIn,
    firstName,
    userRole,
    catCount,
      totalPosts,
      mostPopularPost,
  }
  return json(data)
}

export default function Home() {
  const data = useLoaderData<LoaderData>()
  return (
    <Layout data={data}>
      <Outlet />
    </Layout>
  )
}

export function ErrorBoundary() {
  return <div>Uh oh something is really wrong with the __home loader. Try again later!</div>
}
