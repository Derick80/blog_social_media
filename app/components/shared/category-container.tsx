import {Link} from '@remix-run/react'
import Icon from '~/components/shared/icon'

export interface CategoryContainerProps {
    categories: Array<{
        id: string;
        name: string;
    }>
    isPost: boolean
}

export default function CategoryContainer({ categories, isPost }: CategoryContainerProps) {

    return(
        <div className="w-full md:w-1/4 flex flex-row flex-wrap font-semibold mb-2 mt-2 text-xl justify-center gap1 md:gap-2 uppercase"  >
          <div>
              {isPost ? (<> {categories.map((category)=>(
                  <div key={category.id}  className="flex flex-row border-2 rounded-xl dark:bg-blue-400" >
                      <div  className="flex p-2 tracking-wide hover:cursor-pointer">
                          <Link to={`/categories/${category.name}`} >
                              {category.name}
                          </Link>
                      </div>
                      <div>

                              <div className="dark:text-red-600" >
                                  <button className="">
                                      <Icon icon='close'/>
                                  </button>
                              </div>

                      </div>
                  </div>

              ))}</>) :(
                  <>
                      {categories.map((category)=>(
                          <div key={category.id}  className="flex flex-row border-2 rounded-xl dark:bg-blue-400" >
                              <div  className="flex p-2 tracking-wide hover:cursor-pointer">
                                  <Link to={`/categories/${category.name}`} >
                                      {category.name}
                                  </Link>
                              </div>
                              
                          </div>

                      ))}
                  </>
              )}
          </div>

        </div>
    )
}