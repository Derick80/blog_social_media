import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import React from 'react'
import { getUser } from '~/utils/auth.server'
import { getOwnerProfile, getUserProfile } from '~/utils/profile.server'
import Layout from '~/components/shared/layout'
import ProfileContent from '~/components/profile-content'
import { QueriedUserProfile } from '~/utils/types.server'

// keep a list of the icon ids we put in the symbol

export const meta: MetaFunction = ({ data }: { data: LoaderData | undefined }) => {
  if (!data) {
    return {
      title: 'No Profile found',
      description: 'No profile found',
    }
  }
  return {
    title: `${data.userProfile?.firstName}'s Profile`,
    description: `${data.userProfile?.firstName}'s About me and more`,
  }
}

type LoaderData = {
  userProfile: QueriedUserProfile
  firstName: string
  isLoggedIn: boolean
  isOwner: boolean
  userRole: string
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const userId = user?.id as string
  const isLoggedIn = user?.role === 'ADMIN' || user?.role === 'USER' ? true : false
  const firstName = user?.firstName as string
  const userRole = user?.role as string

  const isOwner = user?.role == 'ADMIN'
  const userProfile = await getOwnerProfile('iderick@gmail.com')

  if (!userProfile) {
    throw new Response(`Derick's profile not found`, {
      status: 404,
    })
  }

  const data: LoaderData = {
    firstName,
    userProfile,
    isLoggedIn,
    isOwner,
    userRole,
  }
  return json(data)
}

export default function About() {
  const data = useLoaderData<LoaderData>()

  const userProfile = data.userProfile

  return <>{userProfile ? <ProfileContent data={data} /> : null}</>
}
