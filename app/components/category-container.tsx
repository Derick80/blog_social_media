import { Link, NavLink } from '@remix-run/react'
import Icon from '~/components/shared/icon'

export interface CategoryContainerProps {
  category: {
    id: string
    name: string
  },
}

export default function CategoryContainer({ category }: CategoryContainerProps) {
  return (
    <div className="mx-2 mt-2 flex">
      <label
        className="h-fit max-w-fit border-black dark:border-white border-2 p-1 text-center text-xs md:text-sm hover:cursor-pointer md:tracking-wide"
        key={category.id}
      >
        <NavLink to={`/categories/${category.name}`}>{category.name}</NavLink>
      </label>
    </div>
  )
}
