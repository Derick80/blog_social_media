import { json, LoaderFunction } from '@remix-run/node'
import { getPostsByCategory } from '~/utils/post.server'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'

import PostPreview from '~/components/post-preview'

// use this to look at json
// http://192.168.86.32:5322/categories?_data=routes%2Fcategories
type LoaderData = {
  postsByCategory: Array<{
    id: string
    title: string
    body: string
    postImg: string
    createdAt: string
    categories: Array<{ id: string; name: string }>
  }>
  isOwner: boolean
  categoryName: string
  isLoggedIn: boolean
  currentUser: string
}
export const loader: LoaderFunction = async ({ params, request }) => {
  const categoryName = params.categoryName as string
  const user = await getUser(request)
  const isOwner = user?.role === 'ADMIN'
  const isLoggedIn = user === null ? false : true

  const currentUser = user?.id as string
  const postsByCategory = await getPostsByCategory(categoryName)
  if (!postsByCategory) {
    throw new Response("Couldn't find any posts with that category", {
      status: 401,
    })
  }

  const data: LoaderData = {
    postsByCategory, isOwner, categoryName, isLoggedIn, currentUser
  }

  return json({ data})
}

export default function CategoryView() {
  const { data } = useLoaderData<LoaderData>()
  return (
    <div className="flex flex-col">
      <div>Posts with the {data.categoryName} Tag</div>

      {data.postsByCategory.map((post) => (
       <PostPreview
       key={post.id}
       post={post}
       isLoggedIn={data.isLoggedIn}
       currentUser={data.currentUser}
       likeCount={post.likes.length}
     />
      ))}
    </div>
  )
}
