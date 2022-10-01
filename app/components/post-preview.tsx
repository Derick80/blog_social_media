import { Link, NavLink } from '@remix-run/react'
import { format } from 'date-fns'
import { SerializedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'

export type PostPreviewProps = {
  post: SerializedPost
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <article>
      <div className="container m-0 p-2 md:p-6">
        <ul className="grid-template-columns-2 md:grid-template-columns-3 grid gap-16 md:gap-8">
          <li>
            <div className="relative flex min-h-full max-w-prose flex-col overflow-hidden rounded-sm border border-black transition-shadow duration-200 ease-in-out">
              <div className="h-40">
                <img src={post.postImg} alt={post.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex grow flex-col p-4">
                <h3 className="block text-2xl font-semibold leading-10 ">
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </h3>
              <div className='flex flex-row'>
              {post?.categories?.map((category) => (
                  <CategoryContainer key={category.id} category={category} />
               ))}
              </div>
                <p>{post.description} <Link to={`/posts/${post.id}`}>...Read more</Link></p>
                <small>{post.userId}</small>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </article>
  )
}
