import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getCategories } from '~/utils/categories.server'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import CategoryContainer from '~/components/category-container'
import { initialCategories } from '~/utils/constants'
import MultiSelect from '~/components/shared/multi-select'

export const loader: LoaderFunction = async () => {
  const { allCategories } = await getCategories()

  if (!allCategories) {
    throw new Response('No Categories Found', { status: 404 })
  }

  const initialCategoryList = allCategories.map((category) => {
    return {
      id: category.id,
      value: category.name,
      name: category.name,
    }
  })

  console.log('initialCategoryList', initialCategoryList)

  const data = {
    initialCategoryList,
  }
  return json({ data })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  // const name = formData.get('name')
  const categories = formData.getAll('categories')
  if (
    // typeof name !==
    typeof categories !== 'object'
  ) {
    return json(
      {
        error: 'invalid form data',
        form: action,
      },
      { status: 400 }
    )
  }

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
