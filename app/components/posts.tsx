import Tooltip from '~/components/shared/tooltip'
import { Link } from '@remix-run/react'
import Icon from '~/components/shared/icon'
import CategoryContainer from '~/components/category-container'

type PostsProps = {
  posts: {
    id: string
    title: string
    body: string
    postImg: string
    categories: Array<{ id: string; name: string }>
  }
  isOwner: boolean
  isPost: boolean
}
export default function Posts({ posts, isOwner, isPost }: PostsProps) {
  return (
    <div
      key={posts.id}
      className='w-full rounded-xl shadow-2xl shadow-grey-300 p-2 md:w-1/2 mt-2 md:mt-4 md:mb-4'
    >

        <h1 className='text-xl md:my-6 border-b-2 md:text-2xl'>
          {posts.title}
        </h1>

      <div className='flex flex-col-reverse p-2 md:flex md:flex-row md:p-2 md:space-x-10'>
        <img
          className='object-contain w-1/2 rounded'
          src={posts.postImg}
          alt='profile'
        />
        <div className='text-base max-w-prose md:text-2xl'>{posts.body}</div>

        <CategoryContainer categories={posts.categories} isPost={isPost} />

      </div>

      {isOwner ? (
        <Tooltip message='Edit Post'>
          <Link to={`/${posts.id}`} className='text-green-600 dark:text-white'>
            Edit Post
          </Link>
        </Tooltip>
      ) : null}
    </div>
  )
}
