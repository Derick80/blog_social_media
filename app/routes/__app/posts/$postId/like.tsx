import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'

import { getUser, requireUserId } from '~/utils/auth.server'
import { createLike, deleteLike } from '~/utils/like.server'

export const loader: LoaderFunction = ({ request }) => {
  throw new Response("This page doesn't exists.", { status: 404 })
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)
  const postId = params.pid
  const userId = user?.id

  if (!userId || !postId) {
    return json({ error: 'invalid form data bad userId or PostId like' }, { status: 400 })
  }
  try {
    if (request.method === 'POST') {
      await createLike({
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      })
    }

    if (request.method === 'DELETE') {
      await deleteLike({ userId, postId })
    }

    return json({ success: true })
  } catch (error) {
    return json({ error: 'invalid form data like' }, { status: 400 })
  }
}
