import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import { getPosts } from '~/utils/post.server'
import PostPreview from '~/components/post-preview'
import { getCategoryCounts } from '~/utils/categories.server'
import CategoryCount from '~/components/category-count'

type LoaderData = {
  userPosts: Awaited<ReturnType<typeof getPosts>>
  catCount: Awaited<ReturnType<typeof getCategoryCounts>>
  isOwner: boolean
  isLoggedIn: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isLoggedIn = user !== null

  const isOwner = user?.role === 'ADMIN'
  const userPosts = await getPosts()
  const catCount= await getCategoryCounts()

  if (!userPosts) {
    throw new Response(`No posts found`, {
      status: 404,
    })
  }

  const data: LoaderData = {
    userPosts,
    catCount,
    isOwner,
    isLoggedIn,
  }
  return json(data)
}

export default function Home() {
  const data = useLoaderData<LoaderData>()
  return (
    <div className='md:flex m-0 p-2 md:p-6 gap-4'>
<div className='flex flex-row flex-wrap md:flex-col'>

{data?.catCount.map((category)=>(
  <CategoryCount key={category.id} category={category} />
))}
</div>
     <div className='md:flex md:flex-wrap gap-4'>
     {data.userPosts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
     </div>
    </div>
  )
}

export function ErrorBoundary() {
  return <div>Sorry, something went wrong! :/ Please try again later.</div>
}
