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
    <div>

        <NavLink
          to={`/categories/${category.name}`}
className='flex items-center px-3 py-1 dark:text-white rounded-md  hover:bg-gray-50 hover:text-gray-900 md:tracking-wide'
          key={category.id}
        >

          <label className='border-2 border-r-0 rounded-tl-md rounded-bl-md pr-1 pl-1 capitalize'>{category.name}</label>

<div className='flex items-center self-stretch px-1 border rounded-tr-md rounded-br-md text-white  bg-gray-700 dark:bg-slate-500'>
{category._count.posts}
</div>





        </NavLink>


    </div>
  )
}
