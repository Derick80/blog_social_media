import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, Outlet, NavLink } from '@remix-run/react'
import NavigationBar from '~/components/navbar/primary-nav'
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
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <header className="order-last grid md:order-first md:col-start-1 md:col-end-1">
        <ul className="mt-4 flex flex-row space-y-4 md:flex-col">
          <li>
            <Tooltip message="View posts">
              <NavLink
                to="/"
                className={({ isActive }) => ` ${isActive ? 'uppercase underline' : 'uppercase'}`}
              >
                Feed
              </NavLink>
            </Tooltip>{' '}
          </li>
          {data.isLoggedIn && (
            <>
              <li>
                <Tooltip message="Write a new blog post">
                  <NavLink
                    to="/posts/new"
                    className={({ isActive }) =>
                      ` ${isActive ? 'uppercase underline' : 'uppercase'}`
                    }
                  >
                    Create
                  </NavLink>
                </Tooltip>
              </li>
              <li>
                <Tooltip message="View drafts">
                  <NavLink
                    to="/drafts"
                    className={({ isActive }) =>
                      ` ${isActive ? 'uppercase underline' : 'uppercase'}`
                    }
                  >
                    Drafts
                  </NavLink>
                </Tooltip>
              </li>
            </>
          )}
          <li>
            <Tooltip message="My Profile">
              <NavLink
                to="/about"
                className={({ isActive }) => ` ${isActive ? 'uppercase underline' : 'uppercase'}`}
              >
                About
              </NavLink>
            </Tooltip>
          </li>
        </ul>
      </header>
      <main className="col-end-3 md:col-start-1">
        {data.userPosts.map((post) => (
          <PostContent key={post.id} post={post} />
        ))}
      </main>
    </div>
  )
}

export function ErrorBoundary() {
  return <div>Uh oh something is really wrong with the __home loader. Try again later!</div>
}
