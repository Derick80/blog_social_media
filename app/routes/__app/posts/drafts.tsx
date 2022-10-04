import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React from 'react'
import { getUser, requireUserId } from '~/utils/auth.server'
import { getUserDrafts } from '~/utils/post.server'

import Sectionheader from '~/components/shared/section-header'
import PostContent from '~/components/post-content'
import { QueriedPost } from '~/utils/types.server'
import PostPreview from '~/components/post-preview'

type LoaderData = {
  user: { email: string }
  userDrafts: QueriedPost[]
  isLoggedIn: boolean
  currentUser: string
}
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request)
  const user = await getUser(request)
  const isLoggedIn = user === null ? false : true
  const currentUser = user?.id as string

  const userDrafts = await getUserDrafts(userId)
  console.log('isLoggedIn at drafts.tsx', isLoggedIn)

  if (!userDrafts) {
    throw new Response('No Drafts', { status: 404 })
  }
  if (currentUser) {
    throw new Response('No user found', { status: 404 })
  }

  const data: LoaderData = {
    userDrafts,
    isLoggedIn,
    currentUser,
  }
  return json({
    data,
  })
}

export default function Drafts() {
  const data = useLoaderData()
  const likeCounts = data.userDrafts.map((post) => post.likes.length)
  console.log('likeCounts at drafts', likeCounts)

  console.log(data)

  return (
    <>
      {data?.userDrafts?.map((post) => (
        <PostPreview
          key={post.id}
          post={post}
          isLoggedIn={data.isLoggedIn}
          currentUser={data.currentUser}
          likeCount={likeCounts}
        />
      ))}
    </>
  )
}

// to={`/__home/${post.id}`}

// to={post.id}
