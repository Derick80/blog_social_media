import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import React from 'react'
import Icon from '~/components/shared/icon'
import Tooltip from '~/components/shared/tooltip'
import { getUser } from '~/utils/auth.server'
import { getUserProfile } from '~/utils/profile.server'
import Layout from '~/components/layout'
import AppBar from '~/components/navbar/appBar'

export const meta: MetaFunction = ({
  data
}: {
  data: LoaderData | undefined
}) => {
  if (!data) {
    return {
      title: 'No Profile found',
      description: 'No profile found'
    }
  }
  return {
    title: `${data.userProfile?.firstName}'s Profile`,
    description: `${data.userProfile?.firstName}'s About me and more`
  }
}
type LoaderData = {
  userProfile: Awaited<ReturnType<typeof getUserProfile>>
  isOwner: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const userId = user?.id as string
  const isOwner = user?.role == 'ADMIN'
  const userProfile = await getUserProfile(userId)

  if (!userProfile) {
    throw new Response(`Derick's profile not found`, {
      status: 404
    })
  }
  const data: LoaderData = {
    userProfile,

    isOwner
  }
  return json(data)
}

export default function About() {
  const data = useLoaderData<LoaderData>()
  const {
    id,
    firstName,
    lastName,
    bio,
    birthDay,
    currentLocation,
    pronouns,
    occupation,
    email,
    profilePicture,
    title
  } = data.userProfile

  return (
    <Layout isOwner={data.isOwner}>
      {data.userProfile ? (
        <div key={id} className=''>

          <div className='max-w-md mx-auto rounded-xl shadow-md overflow-hidden md:max-w-2xl'>

            <div className='text-base md:text-xl underline font-semibold uppercase'>
              {firstName} {lastName}{' '}

          </div>
         <p className='italic'> {title}</p>
            <img
              className='inline max-h-100 max-w-100 md:max-h-600 md:max-w-600'
              src={profilePicture}
              alt='profile'
            />

            <div>
              <div>
                <div className='text-base md:text-xl underline font-semibold'>About Me</div>
                <div>{bio}</div>
                <a href="mailto:derickchoskinson@gmail.com">Send email to me</a>

              </div>
            </div>
            {data.isOwner ? (
            <Tooltip message='Edit Profile'>
              <Link
                to={`/about/${id}`}
                className='text-green-600 dark:text-white'
              >
              Edit Profile
              </Link>
            </Tooltip>
          ) : null}
          </div>
        </div>
      ) : null}
    </Layout>
  )
}
