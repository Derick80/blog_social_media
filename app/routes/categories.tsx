import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getCategories } from '~/utils/categories.server'
import { useActionData, useLoaderData } from '@remix-run/react'
import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import CategoryContainer from '~/components/category-container'
import { SelectBox } from '~/components/shared/select-box'
import { initialCategories } from '~/utils/constants'

export const loader: LoaderFunction = async () => {
  const { allCategories } = await getCategories()
  const cats = await initialCategories
  if (!allCategories) {
    throw new Response('No Categories Found', { status: 404 })
  }
  return json({ cats, allCategories })
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  // const name = formData.get('name')
  const categories = formData.getAll('categories') as string[]
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
  const actionData = useActionData()
  const [formError] = useState(actionData?.error || '')
  const [errors] = useState(actionData?.errors || {})
  const [formData, setFormData] = useState({
    name: actionData?.fields?.name || '',
    categories: actionData?.fields?.categories || data.cats,
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    event.preventDefault()
    setFormData((form) => ({ ...form, [field]: event.target.value }))
  }

  return (
    <>
      <div className="shadow-grey-300 mt-4 mb-4 w-full rounded-xl p-2 text-xl shadow-2xl md:w-1/2">
        <div className="text-base font-extrabold md:text-5xl">Create a New Category</div>
        <div className="mb-2 w-full text-center text-xs font-semibold tracking-wide text-red-500">
          {formError}
        </div>
        <form method="post" className="form-primary">
          <FormField
            htmlFor="name"
            label="name"
            labelClass="uppercase"
            name="name"
            type="textarea"
            value={formData.name}
            onChange={(event: any) => handleInputChange(event, 'name')}
            error={errors?.name}
          />
          <div>

          </div>

        </form>
      </div>
      <CategoryContainer category={data.categories} />

      <div>
        <form method="post">
          <button type="submit">Save</button>
        </form>
      </div>
    </>
  )
}
