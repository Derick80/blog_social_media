import { json, LoaderFunction } from '@remix-run/node'
import { getPostsByCategory } from '~/utils/post.server'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
import Posts from '~/components/posts'
import Sectionheader from '~/components/shared/section-header'

// use this to look at json
// http://192.168.86.32:5322/categories?_data=routes%2Fcategories
type LoaderData = {
  postsByCategory: Array<{
    id: string
    title: string
    body: string
    email: string
    postImg: string
    published: boolean
    categories: Array<{ id: string; name: string }>
  }>
  isOwner: boolean
  categoryName: string
}
export const loader: LoaderFunction = async ({ params, request }) => {
  const categoryName = params.categoryName as string
  const user = await getUser(request)
  const role = await process.env.ADMIN
  const isOwner = user?.email === role
  console.log('catId', categoryName)
  const postsByCategory = await getPostsByCategory(categoryName)
  if (!postsByCategory) {
    throw new Response("Couldn't find any posts with that category", {
      status: 401
    })
  }

  return json({ postsByCategory, isOwner, categoryName })
}

export default function CategoryView() {
  const { postsByCategory, isOwner, categoryName }: LoaderData = useLoaderData()
  return (
    <>
      <Sectionheader>Posts with the {categoryName} Tag</Sectionheader>

      {postsByCategory.map(post => (
        <Posts key={post.id} posts={post} isOwner={isOwner} isPost={false} />
      ))}
    </>
  )
}
