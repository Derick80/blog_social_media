import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getUser } from '~/utils/auth.server'
type LoaderData = {
  isLoggedIn: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isLoggedIn = user === null ? false : true

  const data = {
    isLoggedIn,

  }
  return json(data)
}

export default function BetaRoute() {
  const data = useLoaderData()
  return (
    <div className="flex flex-wrap items-center md:block">

    </div>
  )
}

export function ErrorBoundary() {
  return <div>Uh oh something is really wrong with the __home loader. Try again later!</div>
}
