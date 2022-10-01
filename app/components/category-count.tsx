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
export default function CategoryCount({category}:CategoryCountProps) {
  return (


   <>
   <label
                    className="flex mr-3 h-fit p-1 text-center text-xs md:text-sm hover:cursor-pointer md:tracking-wide"
                    key={category.id}
                  >
                  <NavLink
                  to={`/categories/${category.name}`}
                  className='pl-2 pr-2 border-black dark:border-white border-2 border-r-0'>  {category.name}</NavLink>
                    <div className='pl-2 pr-2 border-black dark:border-white border-2 bg-gray-400 dark:text-black font-semibold'>{category._count.posts}</div>
                  </label>
   </>




  )
}
