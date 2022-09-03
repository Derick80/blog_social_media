import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import AppBar from '~/components/navbar/appBar'
import Layout from '~/components/layout'
import { getUser } from '~/utils/auth.server'

export const meta: MetaFunction = () => ({
  title: `Derick's Personal Blog Feed`,
  description: `See what I've been up to lately`
})
type LoaderData = {
  isOwner: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isOwner = user?.role == 'ADMIN'

  return json({ isOwner })
}

export default function Home() {
  const { isOwner }: LoaderData = useLoaderData()
  return (
    <Layout isOwner={isOwner}>
      <Outlet />
    </Layout>
  )
}

export function ErrorBoundary() {
  return (
    <div className='error-container'>
      Uh oh something is really wrong. Try again later!
    </div>
  )
}
