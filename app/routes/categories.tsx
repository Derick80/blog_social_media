import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getCategories } from '~/utils/categories.server'
import { useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import MultiSelect from '~/components/shared/multi-select'
import { SelectedCategories } from '~/utils/types.server'

type LoaderData = {
  initialCategoryList: SelectedCategories[]
}
export const loader: LoaderFunction = async () => {
  const { initialCategoryList } = await getCategories()

  if (!initialCategoryList) {
    throw new Response('No Categories Found', { status: 404 })
  }

  const data: LoaderData = {
    initialCategoryList,
  }
  return json({ data })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const categories = formData.getAll('categories')

  const errors = {
    // name: validateText(name as string),
  }

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: { categories },
        form: action,
      },
      { status: 400 }
    )
  const selected = categories.map((category) => category) as []

  return redirect('/categories')
}

export default function Categories() {
  const data = useLoaderData()
  const [initialCategories, setInitialCategories] = useState(data.allCategories)

  return (
    <>
      <div className="shadow-grey-300 mt-4 mb-4 flex w-full items-center justify-center rounded-xl p-2 text-xl shadow-2xl">
        <div className="">
          <select
            multiple={true}
            name="categories"
            value={initialCategories}
            placeholder="Pick one or more tags for your post"
            className="w-52 text-white dark:text-black"
          />
        </div>
      </div>
      <MultiSelect
        label="Pick one or More Categories"
        className="text-bold"
        multiple={true}
        name="categories"
        defaultValue={initialCategories}
        options={initialCategories}
      ></MultiSelect>
    </>
  )
}
