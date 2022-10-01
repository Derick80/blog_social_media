import { json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import PostContent from '~/components/post-content'
import { getUser, getUserId } from '~/utils/auth.server'
import { getPost } from '~/utils/post.server'
import { SerializedPost } from '~/utils/types.server'
type LoaderData = {
  post: SerializedPost
  isLoggedin: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = (await getUserId(request)) as string
  const user = await getUser(request)
  const isLoggedIn = user !== null

  const post = await getPost({ id: params.pid as string })
  const data: LoaderData = {
    post,
    isLoggedIn,
  }
  return json(data)
}

export default function PostRoute() {
  const data = useLoaderData<typeof loader>()
  return <div>{data.post && <PostContent key={data.post.id} post={data.post} />}</div>
}
