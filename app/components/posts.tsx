import Tooltip from '~/components/shared/tooltip'
import { Link } from '@remix-run/react'
import Icon from '~/components/shared/icon'
import CategoryContainer from '~/components/category-container'
import Sectionheader from './shared/section-header'
import { format } from 'date-fns'

type PostsProps = {
  posts: {
    id: string
    title: string
    body: string
    createdAt: string
    updatedAt: string
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
      className='rounded-2xl shadow-xl p-2 md:p-4 mb-10 md:mb-14 md:col-span-11'
    >
      <Sectionheader>{posts.title}</Sectionheader>
      <CategoryContainer categories={posts.categories} isPost={isPost} />
      <div className='flex flex-col items-start md:flex-row md:gap-4'>
        <img className='object-cover object-top w-1/2 h-full md:rounded-md mb-6 shadow' src={posts.postImg} alt='profile' />
        <div className='text-base max-w-prose md:text-2xl'>
          {posts.body}
        </div>


      </div>
      <div className='text-m-p-sm md:text-d-psm'>   {format(new Date(posts.createdAt), 'MMMM do, yyyy')}</div>

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
