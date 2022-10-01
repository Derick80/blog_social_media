import { Link, NavLink } from '@remix-run/react'
import { format } from 'date-fns'
import { useReducer } from 'react'
import { SerializedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'

export type PostPreviewProps = {
  post: SerializedPost
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <article className="">
      <div className="">
        <ul className="grid-template-columns-2 md:grid-template-columns-3 grid gap-16 md:gap-8">
          <li>
            <div className="relative flex min-h-full max-w-prose flex-col overflow-hidden rounded-sm border border-black transition-shadow duration-200 ease-in-out">
              <div className="h-40 md:h-60">
                <img src={post.postImg} alt={post.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex grow flex-col p-4">
                <h3 className="block text-2xl font-semibold leading-10 ">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
                <div className="flex flex-row border-t-2 border-black dark:border-white">
                  {post?.categories?.map((category) => (
                    <CategoryContainer key={category.id} category={category} />
                  ))}
                </div>
                <p className="mt-2 indent-4 md:mt-4 md:text-lg md:leading-7">
                  {post.description}{' '}
                  <Link
                    className="font-medium text-sky-300 hover:underline"
                    to={`/posts/${post.id}`}
                  >
                    ...Read more
                  </Link>
                </p>
                <div className="flex flex-row justify-between p-2 md:p-4">
                  <small>{`By ${post.user?.firstName} ${post.user?.lastName}`}</small>
                  <small>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</small>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </article>
  )
}
