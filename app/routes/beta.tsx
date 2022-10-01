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
  return (<div className=''>
     <nav className="w-full flex mx-auto text-center justify-around">
        <ul className='flex' >
          <li >
          <Tooltip message="View posts">
              <span className="material-symbols-outlined">home</span>

              <NavLink
                to="/"
                className={({ isActive }) =>
                  ` ${isActive ? "uppercase underline" : "uppercase"}`
                }
              >
                <p className="hidden md:block">feed</p>
              </NavLink>
            </Tooltip>
          </li>

          <li >
          <Tooltip message="My Profile">
              <span className="material-symbols-outlined">person</span>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  ` ${isActive ? "uppercase underline" : "uppercase"}`
                }
              >
                <p className="hidden md:block">About</p>
              </NavLink>
            </Tooltip>
          </li>
        </ul>
      </nav>
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