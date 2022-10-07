import { LoaderFunction, json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import ProfileContent from '~/components/profile-content'
import { getUser, requireUserId } from '~/utils/auth.server'
import { getAvatar } from '~/utils/avatar.server'

type LoaderData = {
  avatar: {
    id: string
    description: string
    postImg: string
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const userId = await requireUserId(request)
  const avatar = await getAvatar(userId)
  const isLoggedIn = user === null ? false : true

  if (!isLoggedIn) {
    throw new Response('Unauthorized', { status: 401 })
  }
  if (!avatar) {
    return redirect('/avatar/new')
  }
  return json({ avatar, isLoggedIn })
}
export default function Avatar() {
  const data = useLoaderData<LoaderData>()

  const avatar = data.avatar

  return (
    <>
      {avatar ? (
        <>
          <div>
            <div>{avatar.description}</div>
            <img src={avatar.postImg} alt={avatar.description} />
          </div>
        </>
      ) : null}
    </>
  )
}
