import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, Outlet, NavLink } from '@remix-run/react'
import NavigationBar from '~/components/navbar/primary-nav'
import Sidebar from '~/components/navbar/sidebar'
import PostContent from '~/components/post-content'
import Layout from '~/components/shared/layout'
import Tooltip from '~/components/shared/tooltip'
import { getUser } from '~/utils/auth.server'
import { getPosts } from '~/utils/post.server'
type LoaderData = {
  userPosts: Awaited<ReturnType<typeof getPosts>>

  isLoggedIn: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isLoggedIn = user !== null

  const userPosts = await getPosts()

  const data: LoaderData = {
    userPosts,
    isLoggedIn,
  }
  return json(data)
}

export default function BetaRoute() {
  const data = useLoaderData<LoaderData>()
  return (<div className='flex'>
  <Sidebar />
  <div className='p-4 text-2xl font-semibold flex-1 h-screen'>
    <h1>Beta Test Page</h1>
    <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M8 42V18L24.1 6 40 18v24H28.3V27.75h-8.65V42Zm3-3h5.65V24.75H31.3V39H37V19.5L24.1 9.75 11 19.5Zm13-14.65Z"/></svg>
  </div>
  </div>

  )
}

export function ErrorBoundary() {
  return <div>Uh oh something is really wrong with the __home loader. Try again later!</div>
}



// <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
// <Sidebar />
//       <main className="col-end-3 md:col-start-1">
//         {data.userPosts.map((post) => (
//           <PostContent key={post.id} post={post} />
//         ))}
//       </main>
//     </div>