import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import invariant from 'tiny-invariant'
import PostContent from '~/components/post-content'
import { getUser } from '~/utils/auth.server'
import { getPost } from '~/utils/post.server'
import { QueriedPost } from '~/utils/types.server'
type LoaderData = {
  post: QueriedPost
  likeCount: number
  currentUser: string
  isLoggedin: boolean
  isOwner: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request)
  const currentUser = user?.id as string

  const isOwner = user?.role == 'ADMIN'
  const isLoggedIn = user === null ? false : true
  invariant(params.pid, 'Post id is required')
  const post = await getPost({ id: params.pid as string })
  console.log('post pid index', params.pid);

  const likeCount = post?.likes.length as number
  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }

  const data: LoaderData = {
    post,
    likeCount,
    isLoggedIn,
    currentUser,
    isOwner,
  }
  return json(data)
}

export default function PostRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <>
      <div className="">
        pid
        {data.post && (
          <PostContent
            key={data.post.id}
            post={data.post}
            currentUser={data.currentUser}
            likeCount={data.likeCount}
            isLoggedIn={data.isLoggedIn}
          />
        )}
      </div>
    </>
  )
}
