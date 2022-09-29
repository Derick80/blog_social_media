import { Link, NavLink } from '@remix-run/react'
import Icon from '~/components/shared/icon'

export interface CategoryContainerProps {
  category: {
    id: string
    name: string
  }
}

export default function CategoryContainer({ category }: CategoryContainerProps) {
  return (
    <div className="mx-2 flex flex-wrap">
      <label
        className="m-2 h-fit max-w-fit rounded-md border-2 p-2 text-center hover:cursor-pointer md:tracking-wide"
        key={category.id}
      >
        <NavLink to={`/categories/${category.name}`}>{category.name}</NavLink>
      </label>
    </div>
  )
}
