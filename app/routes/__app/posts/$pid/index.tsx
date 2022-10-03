import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import PostContent from '~/components/post-content'
import { getUser, getUserId } from '~/utils/auth.server'
import { getPost } from '~/utils/post.server'
import { SerializedPost } from '~/utils/types.server'
type LoaderData = {
  post: SerializedPost
  likeCount: number
  currentUser: string
  isLoggedin: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = (await getUserId(request)) as string
  const user = await getUser(request)
  const currentUser = user?.id as string

  const isLoggedIn = user !== null

  const post = await getPost({ id: params.pid as string })
  const likeCount = post?.likes.length as number

  const data: LoaderData = {
    post,
    likeCount,
    isLoggedIn,
  }
  return json(data)
}

export default function PostRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <div className="m-0 gap-4 p-2 md:flex md:p-6">
      {data.post && (
        <PostContent
          key={data.post.id}
          post={data.post}
          currentUser={data.currentUser}
          likeCount={data.likeCount}
        />
      )}
    </div>
  )
}
