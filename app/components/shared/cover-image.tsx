import { Link, Links, NavLink } from '@remix-run/react'

type Props = {
  title: string
  src: string
  id: string
}

const CoverImage = ({ title, src, id }: Props) => {
  const image = (
    <img
      src={src}
      alt={`Cover Image for ${title}`}
      className={`h-40 shadow-sm transition-shadow duration-200 hover:shadow-lg`}
    />
  )
  return (
    <div className="sm:mx-0">
      {id ? (
        <Link to={`/posts/${id}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}

export default CoverImage
