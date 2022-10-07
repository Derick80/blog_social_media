import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { getCategories } from '~/utils/categories.server'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import CategoryContainer from '~/components/category-container'
import { initialCategories } from '~/utils/constants'

export const loader: LoaderFunction = async () => {
  const { allCategories } = await getCategories()
  if (!allCategories) {
    throw new Response('No Categories Found', { status: 404 })
  }

  const data = {
    allCategories,
  }
  return json({  data })
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

  return (
    <>
      <div className="shadow-grey-300 mt-4 mb-4 w-full rounded-xl p-2 text-xl shadow-2xl ">

      </div>
    </>
  )
}
