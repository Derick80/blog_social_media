import { json, LoaderFunction } from '@remix-run/node'
import { getPostsByCategory } from '~/utils/post.server'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'

import PostContent from '~/components/post-content'

// use this to look at json
// http://192.168.86.32:5322/categories?_data=routes%2Fcategories
type LoaderData = {
  postsByCategory: Array<{
    id: string
    title: string
    body: string
    email: string
    postImg: string
    createdAt: string
    updatedAt: string
    published: boolean
    categories: Array<{ id: string; name: string }>
  }>
  isOwner: boolean
  categoryName: string
}
export const loader: LoaderFunction = async ({ params, request }) => {
  const categoryName = params.categoryName as string
  const user = await getUser(request)
  const isOwner = user?.role === 'ADMIN'

  const postsByCategory = await getPostsByCategory(categoryName)
  if (!postsByCategory) {
    throw new Response("Couldn't find any posts with that category", {
      status: 401,
    })
  }

  return json({ postsByCategory, isOwner, categoryName })
}

export default function CategoryView() {
  const { postsByCategory, isOwner, categoryName }: LoaderData = useLoaderData()
  return (
    <div className="flex flex-col">
      <div>Posts with the {categoryName} Tag</div>

      {postsByCategory.map((post) => (
        <PostContent key={post.id} post={post} />
      ))}
    </div>
  )
}
