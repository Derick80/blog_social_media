import { LoaderFunction, json, ActionFunction, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import React from 'react'
import invariant from 'tiny-invariant'
import { getCategories } from '~/utils/categories.server'
import { editMiniPostCategories, getMiniPostById } from '~/utils/postv2.server'
import { CategoryForm, SelectedCategories } from '~/utils/types.server'

export const loader: LoaderFunction = async ({  params }) => {
  const initialCategoryList = await getCategories()
  const miniPostId = params.miniPostId
  invariant(miniPostId, 'No Mini Post Id')
  const { minifiedPost } = await getMiniPostById(miniPostId)

  if (!minifiedPost || !initialCategoryList) {
    throw new Error('No Mini Post')
  }

  const data = {
    minifiedPost,
    initialCategoryList,
  }

  return json(data)
}
export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const postId = params.miniPostId
  const categories = formData.getAll('categories')

  // reshape category form data for db
  const correctedCategories = categories.map((cat) => {
    return {
      name: cat
    }
  }
  ) as CategoryForm[]

  invariant(postId, 'No Post Id')

  await editMiniPostCategories(postId, correctedCategories)
  return redirect('/miniPosts')

}

export default function MiniPost() {
  const data = useLoaderData()
  const { initialCategoryList } = data.initialCategoryList

  const tags = data.minifiedPost.selectedTags.map((category: { value: string }) => {
    return category.value
  })


  const [formData, setFormData] = React.useState({
    categories: tags,
  })

  const [selected, setSelected] = React.useState<string[]>(tags)


  const handleSelectChanges = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    if (formData.categories.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((item:string) => item !== value),
      }))
      setSelected((prev) => [...prev.filter((item) => item !== value)])
    } else {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }))
      setSelected((prev) => [...prev, value])
    }
  }


  return (
    <div className="grid grid-cols-1 grid-rows-1 justify-center gap-4 p-2 md:grid-cols-6 md:grid-rows-none md:gap-8 md:p-4">
      <div className="col-span-full col-start-1 mb-2 justify-center md:col-start-2 md:col-end-6 md:row-end-1 md:mb-2 md:flex-wrap">
        <form method="post" className="form-primary justify-center">
          <div className="flex flex-col">
            <div className="mx-1 mt-2 mb-2 flex flex-wrap space-x-2 md:mt-4">
              {selected.map((item) => (
                <span
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      categories: prev.categories.filter((selectedItem: string) => selectedItem !== item),
                    }))
                    setSelected(selected.filter((selectedItem) => selectedItem !== item))
                  }}
                  className="flex items-center rounded-md px-3 py-1 hover:bg-gray-50  hover:text-gray-900 dark:text-white md:tracking-wide"
                >
                  <label className="rounded-tl-md rounded-bl-md border-2 border-r-0 pr-1 pl-1 capitalize">
                    {item}
                  </label>
                  <span className="material-symbols-outlined flex items-center self-stretch rounded-tr-md rounded-br-md border bg-gray-700 px-1  text-white dark:bg-slate-500">
                    close
                  </span>
                </span>
              ))}
            </div>
            <select
              className="form-field-primary flex w-full border-t-0 p-2"
              multiple
              size={initialCategoryList.length}
              name="categories"
              value={formData.categories}
              onChange={(event) => handleSelectChanges(event)}
            >
              {initialCategoryList.map((item: Partial<SelectedCategories>) => (
                <option className="" key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
          <div className="text-container max-w-full">
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
