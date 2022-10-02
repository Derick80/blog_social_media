import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, Outlet, NavLink } from '@remix-run/react'
import CategoryContainer from '~/components/category-container'
import NavigationBar from '~/components/navbar/primary-nav'
import Sidebar from '~/components/navbar/sidebar-stats'
import PostContent from '~/components/post-content'
import Layout from '~/components/shared/layout'
import Tooltip from '~/components/shared/tooltip'
import { getUser } from '~/utils/auth.server'
import { getCategories, getCategoryCounts } from '~/utils/categories.server'
import { getPosts } from '~/utils/post.server'
type LoaderData = {
  isLoggedIn: boolean
}
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const isLoggedIn = user !== null
  const { allCategories } = await getCategories()
  const catCount = await getCategoryCounts()

  console.log(catCount)

  const data = {
    isLoggedIn,
    allCategories,
    catCount,
  }
  return json(data)
}

export default function BetaRoute() {
  const data = useLoaderData()
  return (
    <div className="flex flex-wrap items-center md:block">
      {data?.catCount?.map((category) => (
        <div className="capitalize">
          <label
            className="mr-3 flex h-fit p-1 text-center text-xs hover:cursor-pointer md:text-sm md:tracking-wide"
            key={category.id}
          >
            <span className="border-2 border-r-0 border-black pl-2 pr-2 dark:border-white">
              {' '}
              {category.name}
            </span>
            <div className="border-2 border-black bg-gray-400 pl-2 pr-2 font-semibold dark:border-white dark:text-black">
              {category._count.posts}
            </div>
          </label>
        </div>
      ))}
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
