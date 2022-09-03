import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { format } from 'date-fns'
import React from 'react'
import ContentContainer from '~/components/shared/content-container'
import Icon from '~/components/shared/icon'
import Tooltip from '~/components/shared/tooltip'
import { getUser } from '~/utils/auth.server'
import { getUserProfile } from '~/utils/profile.server'
import Layout from '~/components/layout'
import AppBar from '~/components/appBar'

export const meta: MetaFunction = ({
  data,

}: {
  data: LoaderData | undefined
}) => {
  if (!data) {
    return {
      title: 'No Profile found',
      description: 'No profile found',
    }
  }
  return {
    title: `"${data.userProfile}"'s Profile`,
    description: `"${data.userProfile?.firstName}"'s About me and more`,
  }
}
type LoaderData = {
  userProfile: Awaited<ReturnType<typeof getUserProfile>>
  role: string
  user: { id: string; email: string }
  isOwner: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const role = await process.env.ADMIN as string
  const isOwner = user?.email === role
  const userProfile = await getUserProfile(role)
  if (!userProfile || !user) {
    throw new Response(`Derick's profile not found`, {
      status: 404,
    })
  }
  const data: LoaderData = {
    userProfile,
    role,
    user,
    isOwner,
  }
  return json(data)
}

export default function About () {
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
    profilePicture
  } = data.userProfile

  // @ts-ignore
  return (
    <Layout>
      <AppBar user={ data.user } isOwner={ data.isOwner } />
      <ContentContainer>
        { data.userProfile ? (
          <div
            key={ id }
            className="w-full md:w-1/2 rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 mt-4 mb-4"
          >
            <div className="flex flex-row">
              <h1 className="my-6 border-b-2 text-center text-3xl">
                { firstName } { lastName }{ " " }
              </h1>
            </div>
            <div className="flex flex-col p-2 items-center md:flex md:flex-row md:p-2 md:space-x-10">
              <img
                className="object-contain w-1/2 rounded"
                src={ profilePicture }
                alt="profile"
              />
              <div className="flex flex-col">
                <div className="uppercase font-semibold">About Me</div>
                { bio }

                <div className="flex flex-col">
                  <div>
                    <div className="uppercase font-semibold">Birthday</div>
                    { format(new Date(birthDay), "MMMM, do") }
                  </div>
                  <div>
                    <div className="uppercase font-semibold">Current City</div>
                    { currentLocation }
                  </div>
                  <div>
                    <div className="uppercase font-semibold">My Pronouns</div>
                    { pronouns }
                  </div>
                  <div>
                    <div className="uppercase font-semibold">My Occupation</div>
                    { occupation }
                  </div>
                  <div>
                    <div className="uppercase font-semibold">Email me</div>
                    { email }
                  </div>

                </div>
              </div>
            </div>
            <div className="flex flex-row justify-around p-2">

              <div>
                <a
                  href="https://www.linkedin.com/in/dhoskinson"
                  className="social"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="fill-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="https://www.github.com/Derick80"
                  className="social"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="fill-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>
            </div>
            { data.isOwner ? (
              <Tooltip message="Edit Profile">
                <Link to={ `/about/${id}` } className="text-green-600 dark:text-white">
                  <Icon icon="edit_document" />
                </Link>
              </Tooltip>
            ) : null }
          </div>
        ) : <>Loading...</> }
      </ContentContainer>
    </Layout>
  )
}
