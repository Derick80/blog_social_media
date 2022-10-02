import { FormMethod, useFetcher, useLoaderData } from '@remix-run/react'
import { useState } from 'react'
import { QueriedPost } from '~/utils/types.server'

export type LikeContainerProps = {
  post: QueriedPost
  currentUser: string
  postId: string
  likeCount: number
  likes: Array<{
    postId: string
    userId: string
  }>
}

export default function LikeContainer({ likes, post, currentUser, postId }: LikeContainerProps) {
  const fetcher = useFetcher()
  const userLikedPost = likes.find(({ userId }) => userId === currentUser) ? true : false

  const [likeCount, setLikeCount] = useState(post?._count?.likes || 0)
  const [isLiked, setIsLiked] = useState(userLikedPost || false)

  console.log('likesContainer', likes)

  console.log('userLikedPost', userLikedPost)
  const toggleLike = async () => {
    let method: FormMethod = 'delete'
    if (userLikedPost) {
      setLikeCount(likeCount - 1)
      setIsLiked(false)
    } else {
      method = 'post'
      setLikeCount(likeCount + 1)
      setIsLiked(true)
    }

    fetcher.submit({ userId: currentUser, postId }, { method, action: `/posts/${postId}/like` })
    console.log('clicked', postId, 'currentUser', currentUser)
  }
  return (
    <div>
      {userLikedPost ? (
        <button onClick={toggleLike} className="rounded-md bg-red-500 px-2 py-1 text-white">
          Unlike
        </button>
      ) : (
        <button onClick={toggleLike} className="rounded-md bg-blue-500 px-2 py-1 text-white">
          Like
        </button>
      )}
      <span className="min-w-[0.75rem]">{likeCount}</span>
    </div>
  )
}
