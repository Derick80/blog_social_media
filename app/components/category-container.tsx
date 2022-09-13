import { Link } from '@remix-run/react'
import Icon from '~/components/shared/icon'

export interface CategoryContainerProps {
  categories: Array<{
    id: string
    name: string
  }>
  isPost: boolean
}

export default function CategoryContainer({
  categories,
  isPost
}: CategoryContainerProps) {
  return (
    <div className='flex flex-row content font-semibold mb-2 mt-2 text-sm md:text-xl gap-1 md:gap-3 uppercase'>
      {categories.map(category => (
        <div
          key={category.id}
          className='max-w-fit h-fit text-center border-2 dark:bg-blue-400'
        >
          <div className='md:p-2 md:tracking-wide hover:cursor-pointer'>
            <Link to={`/categories/${category.name}`}>{category.name}</Link>
          </div>
          {isPost ? (
            <div>
              <div className='dark:text-red-600'>
                <button className=''
                action='_action'
                value='removeCategory'
                >
                  <Icon icon='close' />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
