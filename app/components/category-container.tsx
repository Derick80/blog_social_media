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
    <div className="mx-2 mt-2 flex md:mt-4">
      <label
        className="h-fit max-w-full border-2 border-black p-1 text-center text-xs hover:cursor-pointer dark:border-white md:text-sm md:tracking-wide"
        key={category.id}
      >
        <NavLink to={`/categories/${category.name}`}>{category.name}</NavLink>
      </label>
    </div>
  )
}
