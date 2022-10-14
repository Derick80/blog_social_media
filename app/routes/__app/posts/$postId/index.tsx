import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import PostContent from '~/components/post-content'
import { getUser } from '~/utils/auth.server'
import { getPost } from '~/utils/post.server'
import { QueriedPost, SinglePost } from '~/utils/types.server'
type LoaderData = {
  reducedPost: SinglePost
  likeCount: number
  currentUser: string
  isLoggedIn: boolean
  isOwner: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request)
  const currentUser = user?.id as string

  const isLoggedIn = user === null ? false : true
  invariant(params.postId, 'Post id is required')
  const { reducedPost } = await getPost(params.postId)

  if (!reducedPost) {
    throw new Response('Post not found', { status: 404 })
  }

  const data: LoaderData = {
    reducedPost,

    isLoggedIn,
    currentUser,
    isOwner: currentUser === reducedPost?.userId,
  }
  return json(data)
}

export default function PostRoute() {
  const data = useLoaderData<LoaderData>()
  const { reducedPost, isOwner, currentUser, isLoggedIn } = data
  return (
    <>
      <div className="">
        pid
        {reducedPost && (
          <PostContent
            key={reducedPost.id}
            post={reducedPost}
            currentUser={currentUser}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>
    </>
  )
}
