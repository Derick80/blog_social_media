import { Post } from '@prisma/client'
import { ActionFunction } from '@remix-run/node'
import { getUser } from '~/utils/auth.server'
import { createNewPost } from '~/utils/post.server'

export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request)
  const formData = await request.formData()
  const { body } = Object.fromEntries(formData) as Post

  const userId = user?.id
  const postId = params.pid

  if (!userId || !postId) {
    throw new Response('Unauthorized', { status: 401 })
  }

  try {
    if (request.method === 'POST') {
      await createNewPost({
        body: body,

        parent: {
          connect: {
            id: postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      })
    }

    const headers = await flashAndCommit(request, 'Your comment has been added')

    return json({ success: true }, { headers })
  } catch (error) {
    if (error instanceof Error) return badRequest({ message: error.message })
    return serverError({ message: 'Something went wrong' })
  }
}
