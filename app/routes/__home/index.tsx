import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { getPosts } from '~/utils/post.server'
import ContentContainer from '~/components/shared/content-container'
import Posts from '~/components/posts'

type LoaderData = {
  userPosts: Awaited<ReturnType<typeof getPosts>>
  isOwner: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const role = await process.env.ADMIN
  const isOwner = user?.email === role
  const userPosts = await getPosts()

  if (!userPosts) {
    throw new Response(`No posts found`, {
      status: 404
    })
  }
  const data: LoaderData = {
    userPosts,
    isOwner
  }
  return json(data)
}
export default function Home() {
  const data = useLoaderData<LoaderData>()
  return (
    <>
      <div className='text-base md:text-3xl font-extrabold uppercase underline'>
        Posts
      </div>
      {data.userPosts.map(post => (
        <Posts
          key={post.id}
          posts={post}
          isOwner={data.isOwner}
          isPost={false}
        />
      ))}
    </>
  )
}

export function ErrorBoundary() {
  return (
    <div className='error-container'>
      Sorry, something went wrong! :/ Please try again later.
    </div>
  )
}
