import { Link } from '@remix-run/react'
import { SerializedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'

type PostProps = {
  post: SerializedPost
}

export default function PostContent({ post }: PostProps) {
  return (
    <article className='flex flex-col'>
      <div className=''>
        <Link to={`/posts/${post.id}`}>
          <h1 className='mt-6 border-b-2 text-left text-2xl md:text-4xl uppercase font-semibold'>
            {post.title}
          </h1>
        </Link>
        <p className='mt-2 text-left text-lg md:text-2xl'>{post.createdAt}</p>
        <div className='flex flex-row'>
          {post?.categories?.map((category) => (
            <CategoryContainer
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>
      <div className='flex'>
        <img
          style={{
            backgroundSize: 'cover',
            width: '50%',
            aspectRatio: 'auto',
            ...(post.postImg ? { backgroundImage: `url(${post.postImg})` } : {})
          }}
          src={post.postImg}
          alt='profile'
        />
        <p>{post.body}</p>
      </div>
    </article>
  )
}
