import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { getPosts } from '~/utils/post.server'
import PostPreview from '~/components/post-preview'

type LoaderData = {
  userPosts: Awaited<ReturnType<typeof getPosts>>
  isOwner: boolean
  isLoggedIn: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isLoggedIn = user !== null

  const isOwner = user?.role === 'ADMIN'
  const userPosts = await getPosts()

  if (!userPosts) {
    throw new Response(`No posts found`, {
      status: 404,
    })
  }

  const data: LoaderData = {
    userPosts,
    isOwner,
    isLoggedIn,
  }
  return json(data)
}

export default function Home() {
  const data = useLoaderData<LoaderData>()
  return (
    <div className='md:flex'>
      {data.userPosts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  )
}

export function ErrorBoundary() {
  return <div>Sorry, something went wrong! :/ Please try again later.</div>
}
