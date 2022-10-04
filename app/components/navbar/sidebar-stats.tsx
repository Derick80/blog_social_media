import { NavLink, useFetcher } from '@remix-run/react'
import { useEffect } from 'react'
import { QueriedPost } from '~/utils/types.server'
import Button from '../shared/button'

type SideBarStatsProps = {
  totalPosts: number
  mostPopularPost: QueriedPost
}
export default function SideBarStats({ totalPosts, mostPopularPost }: SideBarStatsProps) {
  const hottest = useFetcher()

  useEffect(() => {
    if (hottest.type === 'init') {
      hottest.load('/?index')
    }
  }, [hottest])

  return (
    <div>
      <label className="text-xl font-bold text-gray-700 underline dark:text-white">
        Site Stats
      </label>

      <div className="flex flex-col">
        <div>
          <label className="text-base">Total posts:</label>
          <p> {totalPosts}</p>
        </div>

        <Button type="submit" variant="outlined">
          <NavLink to={`/posts/${mostPopularPost.id}`}>
            <label>Hottest Post</label>
          </NavLink>
        </Button>
        <div className="flex md:order-2"></div>
      </div>
    </div>
  )
}
