import { Link } from '@remix-run/react'
import { format } from 'date-fns'
import { QueriedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'
import LikeContainer from './like-container'

type PostProps = {
  post: QueriedPost
  currentUser: string
  isLoggedIn: boolean
}

export default function PostContent({ post, currentUser, isLoggedIn }: PostProps) {
  const likeCounts = post.likes.length as number
  return (
    <article key={post.id} className="p-2">
      <div className="flex flex-col overflow-hidden rounded-md border border-black transition-shadow duration-200 ease-in-out">
        <h1 className="border-b-2 p-2 text-left text-2xl font-semibold uppercase md:mt-6 md:text-4xl">
          {post.title}
        </h1>

        <div className="flex flex-auto items-center justify-between p-2 md:flex-row md:p-4">
          <div className=" flex flex-row justify-center">
            {post.selectedPostCategories.map((category) => (
              <CategoryContainer key={category.id} category={category} />
            ))}
          </div>

          <small>{`By ${post.user?.firstName} ${post.user.lastName}`}</small>
          <small>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</small>
          <LikeContainer
            postId={post.id}
            likes={post.likes}
            currentUser={currentUser}
            likeCount={likeCounts}
            post={post}
            isLoggedIn={isLoggedIn}
          />
          {currentUser === post.user.id ? (
            <div className="flex flex-row gap-5">
              <Link to={`/posts/${post.id}/edit`} className="flex">
                <button type="button">Edit</button>
              </Link>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <div className="h-40 md:h-60">
            <img src={post.postImg} alt={post.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col p-2 indent-4 leading-5">{post.description}</div>

          <p className="border-t-2 border-black p-2 indent-4 dark:border-white md:p-2 md:text-lg md:leading-7">
            {post.body}
          </p>
        </div>
      </div>
    </article>
  )
}
