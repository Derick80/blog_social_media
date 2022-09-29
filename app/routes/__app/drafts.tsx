import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React from 'react'
import { getUser, requireUserId } from '~/utils/auth.server'
import { getUserDrafts } from '~/utils/post.server'

import Sectionheader from '~/components/shared/section-header'
import PostContent from '~/components/post-content'

type LoaderData = {
  user: { email: string }
  userDrafts: {
    id: string
    title: string
    body: string
    postImg: string
    published: boolean
    categories: Array<{ id: string; name: string }>
  }
  id: string

  isOwner: boolean
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  const user = await getUser(request)
  const isOwner = user?.role === 'ADMIN'
  const userDrafts = await getUserDrafts(userId)

  return json({
    userDrafts,
    user,
    isOwner,
  })
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
}
export default function Drafts() {
  const {
    userDrafts,

    isOwner,
  } = useLoaderData()
  const actionData = useActionData()

  return (
    <>
      <Sectionheader>Drafts</Sectionheader>
      {userDrafts.map((posts: typeof userDrafts) => (
        <PostContent key={posts.id} post={posts} />
      ))}
    </>
  )
}

// to={`/__home/${post.id}`}

// to={post.id}
