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
      className='dark:bg-zinc-600 rounded-2xl shadow-xl p-2 md:p-4 mb-10 md:mb-14 md:col-span-11'
    >
      <Sectionheader>{posts.title}</Sectionheader>
      <hr className="w-3/4 my-3 h-px bg-white-200 border-0 dark:bg-white"/>

      <CategoryContainer categories={posts.categories} isPost={isPost} />
      <hr className="my-3 h-px bg-white-200 border-0 dark:bg-white"/>

      <div className='flex flex-col items-start md:flex-row md:gap-6'>
        <img className='object-cover object-top w-1/2 h-full md:rounded-md mb-6 shadow'
         style={{
          backgroundSize: 'cover',
          ...(posts.postImg ? { backgroundImage: `url(${posts.postImg})` } : {})
        }}
        src={posts.postImg} alt='profile' />
        <div className='text-base max-w-prose md:text-2xl'>
          {posts.body}
        </div>


      </div>
      <div className='text-m-p-sm md:text-d-psm'>   {format(new Date(posts.createdAt), 'MMMM do, yyyy')}</div>

      {isOwner ? (
       <div className='flex flex-row justify-end'>
         <Tooltip message='Edit Post'>
          <Link to={`/${posts.id}`} className='dark:text-white font-semibold'>
            EDIT
          </Link>
        </Tooltip>
        </div>
      ) : null}
    </div>
  )
}
