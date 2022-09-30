import { Link, NavLink } from '@remix-run/react'
import { format } from 'date-fns'
import { SerializedPost } from '~/utils/types.server'
import CoverImage from './shared/cover-image'

export type PostPreviewProps ={
    post:  SerializedPost


}

export default function PostPreview({post }:PostPreviewProps) {
  return (
    <div>
    <div className="mb-5">
      <CoverImage id={post.id} title={post.title} src={post.postImg} />
    </div>
    <h3 className="text-3xl mb-3 leading-snug">
      <Link to={`/posts/${post.id}`}className="hover:underline">{post.title}
      </Link>
    </h3>
    <div className="text-lg mb-4">
     { format(new Date(post.createdAt), 'MMMM dd, yyyy')}
    </div>
    <p className="text-lg leading-relaxed mb-4">{post.body}</p>

  </div>
  )
}
