import { Post } from '@prisma/client'
import { Link, NavLink } from '@remix-run/react'
import { format } from 'date-fns'
import { QueriedPost, SerializedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'
import LikeContainer from './like-container'

export type HeroPostProps = {
  post: QueriedPost
  isLoggedin: boolean
}

export default function HeroPost({ post, isLoggedin }: HeroPostProps) {
  return (
    <article className="">
      <div className="relative flex min-h-full flex-col overflow-hidden rounded-md border border-black transition-shadow duration-200 ease-in-out">
        <div className="border-b-2 border-black p-2 dark:border-white md:px-4">
          <h3 className="block text-xl font-semibold leading-6 md:text-3xl md:leading-10 ">
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h3>
        </div>
        <div className="h-40 md:h-80 lg:h-96">
          <img src={post.postImg} alt={post.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex grow flex-col p-4">
          <p className="border-t-2  border-black pt-2 indent-4 dark:border-white md:pt-4 md:text-lg md:leading-7">
            {post.description}{' '}
            <Link className="font-medium text-sky-300 hover:underline" to={`/posts/${post.id}`}>
              ...Read more
            </Link>
          </p>
          <div className="flex flex-row">
            {post?.categories?.map((category) => (
              <CategoryContainer key={category.id} category={category} />
            ))}
          </div>
          <div className="flex flex-row items-center justify-between p-2 md:p-4">
            <small>{`By ${post.user?.firstName} ${post.user?.lastName}`}</small>
            <small>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</small>
          </div>
        </div>
      </div>
    </article>
  )
}
