import { NavLink } from '@remix-run/react'

export interface CategoryCountProps {
  category: {
    id: string
    name: string
    _count: {
      posts: number
    }
  }
}
export default function CategoryCount({ category }: CategoryCountProps) {
  return (
    <>
      <label
        className="mr-3 flex h-fit p-1 text-center text-xs hover:cursor-pointer md:text-xs md:tracking-wide"
        key={category.id}
      >
        <NavLink
          to={`/categories/${category.name}`}
          className="border-2 border-r-0 border-black pl-2 pr-2 dark:border-white"
        >
          {' '}
          {category.name}
        </NavLink>
        <div className="border-2 border-black bg-gray-400 pl-2 pr-2 font-semibold dark:border-white dark:text-black">
          {category._count.posts}
        </div>
      </label>
    </>
  )
}
