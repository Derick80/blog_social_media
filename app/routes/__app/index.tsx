import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { getPosts } from '~/utils/post.server'
import PostPreview from '~/components/post-preview'
import { getCategoryCounts } from '~/utils/categories.server'
import CategoryCount from '~/components/category-count'
import { QueriedPost } from '~/utils/types.server'

type LoaderData = {
  userPosts: QueriedPost[]
  likeCount: number[]
  catCount: Awaited<ReturnType<typeof getCategoryCounts>>
  isOwner: boolean
  isLoggedIn: boolean
  currentUser: string
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isLoggedIn = user !== null
  const currentUser = user?.id as string
  const isOwner = user?.role === 'ADMIN'
  const { userPosts } = await getPosts()
  const catCount = await getCategoryCounts()
  const likeCount = userPosts.map((post) => post.likes.length)
  if (!userPosts) {
    throw new Response(`No posts found`, {
      status: 404,
    })
  }

  const data: LoaderData = {
    likeCount,
    userPosts,
    catCount,
    isOwner,
    isLoggedIn,
    currentUser,
  }
  return json(data)
}

export default function Home() {
  const data = useLoaderData<LoaderData>()
  return (
    <div className="m-0 gap-4 p-2 md:flex md:p-6">
      <div className="flex flex-row flex-wrap md:flex-col min-w-fit text-sm md:text-base">

        {data?.catCount.map((category) => (
          <CategoryCount key={category.id} category={category} />
        ))}
      </div>
      <div className="gap-4 md:flex md:flex-wrap">
        {data.userPosts.map((post) => (
          <PostPreview key={post.id} post={post} currentUser={data.currentUser} />
        ))}
      </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <div>Sorry, something went wrong! :/ Please try again later.</div>
}
