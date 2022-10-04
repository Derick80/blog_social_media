import { Link } from '@remix-run/react'
import { format } from 'date-fns'
import { QueriedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'
import LikeContainer from './like-container'
import Button from './shared/button'

type PostProps = {
  post: QueriedPost
  currentUser: string
  isLoggedIn: boolean
  likeCount: number
}

export default function PostContent({ post, currentUser, likeCount, isLoggedIn }: PostProps) {
  const likeCounts = post.likes.length as number
  return (
    <article key={post.id}>
      <div className="relative flex min-h-full max-w-prose flex-col overflow-hidden rounded-md border border-black transition-shadow duration-200 ease-in-out">
        <h1 className="mt-6 border-b-2 text-left text-2xl font-semibold uppercase md:text-4xl">
          {post.title}
        </h1>

        <div className="flex flex-row items-center justify-between p-2 md:p-4">
          <small>{`By ${post.user?.firstName} ${post.user?.lastName}`}</small>
          <small>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</small>
          <LikeContainer
            postId={post.id}
            likes={post.likes}
            currentUser={currentUser}
            likeCount={likeCounts}
            post={post}
            isLoggedIn={isLoggedIn}
          />
        </div>
        <div className="mb-4 flex flex-row border-t-2 border-black dark:border-white md:mb-8">
          {post?.categories?.map((category) => (
            <CategoryContainer key={category.id} category={category} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="h-40 md:h-60">
          <img
            src={post.postImg}
            alt={post.title}
            className="object-fit h-full w-full md:object-cover"
          />
        </div>
        <div className="flex flex-col gap-5">{post.description}</div>
        <p className="mt-2 indent-4 md:mt-4 md:text-lg md:leading-7">{post.body}</p>
      </div>
      {currentUser === post?.userId ? (
        <div className="flex flex-row gap-5">
          <Link to={`/${post.id}`} className="flex">
            <Button type="button">Edit</Button>
          </Link>
        </div>
      ) : null}
    </article>
  )
}
