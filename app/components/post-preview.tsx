import { Link, NavLink } from '@remix-run/react'
import { format } from 'date-fns'
import { SerializedPost } from '~/utils/types.server'
import CoverImage from './shared/cover-image'

export type PostPreviewProps ={
    post:  SerializedPost


}

export default function PostPreview({post }:PostPreviewProps) {
  return (
    <article>
    <div className='container p-2 m-0 md:p-4'>
      <ul className='grid grid-template-columns-2 md:grid-template-columns-3 gap-16 md:gap-8'>
<li>
  <div className='flex flex-col border border-black rounded-sm max-w-prose min-h-full relative overflow-hidden transition-shadow duration-200 ease-in-out'>
<div className='h-40'>
  <img src={post.postImg} alt={post.title} className='h-full w-full object-cover' />
</div>
<div className='flex flex-col grow p-4'>
  <h3 className='text-2xl leading-10 font-semibold block '>
    <Link to={`/posts/${post.id}`}>{post.title}</Link>
  </h3>
  <p>{post.body}</p>
  <small>{post.userId}</small>
</div>
  </div>
</li>

      </ul>

    </div>

  </article>
  )
}
