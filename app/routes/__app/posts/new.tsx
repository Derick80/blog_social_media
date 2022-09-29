import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useEffect, useRef, useState } from 'react'
import { ImageUploader } from '~/components/image-uploader'
import FormField from '~/components/shared/form-field'

import { getUser, requireUserId } from '~/utils/auth.server'
import { createDraft } from '~/utils/post.server'
import { validateText } from '~/utils/validators.server'
import { getCategories } from '~/utils/categories.server'
import Sectionheader from '~/components/shared/section-header'
export function ErrorBoundary() {
  return (
    <div>Sorry, something went wrong loading the create new Post page. Please try again later!</div>
  )
}

type LoaderData = {
  allCategories: Array<{ id: string; name: string }>
  isOwner: boolean
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const { allCategories } = await getCategories()
  const isOwner = user?.role == 'ADMIN'
  if (!isOwner) {
    throw new Response('Unauthorized', { status: 401 })
  }
  if (!allCategories) {
    throw new Response('No Categories', { status: 404 })
  }

  const data: LoaderData = {
    allCategories,
    isOwner,
  }

  return json(data)
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    title: string | undefined
    body: string | undefined
    categories?: object | undefined
    postImg: string | undefined
  }
  fields?: {
    title: string
    body: string
    postImg: string
  }
  categories?: Array<{ id: string; name: string }>
}

const badRequest = (data: ActionData) => {
  json(data, { status: 400 })
}
export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request)
  const formData = await request.formData()
  const title = formData.get('title')
  const body = formData.get('body')
  const postImg = formData.get('postImg')
  const categories = formData.getAll('categories') as []

  // || typeof body !== "string" || typeof postImg !== "string"

  if (
    typeof title !== 'string' ||
    typeof body !== 'string' ||
    typeof postImg !== 'string' ||
    typeof categories !== 'object'
  ) {
    return badRequest({
      formError: 'Form not submitted correctly',
    })
  }

  const fieldErrors = {
    title: validateText(title as string),
    body: validateText(body as string),
    postImg: validateText(postImg as string),
  }

  const fields = { title, body, postImg }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
    })
  }

  const converted = categories.map((category) => {
    return { name: category }
  })

  await createDraft({
    ...fields,
    userId,
    categories: converted,
  })

  return redirect('drafts')
}

export default function NewPostRoute() {
  const { allCategories } = useLoaderData<LoaderData>()
  const actionData = useActionData()
  const firstLoad = useRef(true)
  const [formError, setFormError] = useState(actionData?.error || '')
  const [errors, setErrors] = useState(actionData?.errors || {})
  console.log(actionData)
  const [formData, setFormData] = useState({
    title: actionData?.fields?.title || '',
    body: actionData?.fields?.body || '',
    postImg: actionData?.fields?.postImg || '',
    categories: actionData?.categories || [],
  })
  useEffect(() => {
    if (!firstLoad.current) {
      setFormError('')
    }
  }, [formData])

  useEffect(() => {
    firstLoad.current = false
  }, [])

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }))
  }
  const handleFileUpload = async (file: File) => {
    const inputFormData = new FormData()
    inputFormData.append('postImg', file)
    const response = await fetch('/image', {
      method: 'POST',
      body: inputFormData,
    })

    const { imageUrl } = await response.json()
    console.log('imageUrl', imageUrl)

    setFormData({
      ...formData,
      postImg: imageUrl,
    })
  }
  return (
    <>
      <div>
        <Sectionheader>Write a new post</Sectionheader>
        <div>{formError}</div>
        <form
          method="post"
          onSubmit={(e) => (!confirm('Are you sure?') ? e.preventDefault() : true)}
        >
          <FormField
            htmlFor="title"
            label="Title"
            name="title"
            type="textarea"
            value={formData.title}
            onChange={(event) => handleInputChange(event, 'title')}
            aria-invalid={Boolean(actionData?.fieldErrors?.title) || undefined}
            aria-errormessage={actionData?.fieldErrors?.title ? 'title-error' : undefined}
          />
          {actionData?.fieldErrors?.title ? (
            <p role="alert" id="title-error">
              {actionData.fieldErrors.title}
            </p>
          ) : null}
          <p>
            <label>
              Content
              <textarea
                name="body"
                value={formData.body}
                onChange={(event) => handleInputChange(event, 'body')}
              />
            </label>
          </p>
          <div>
            <label>Tag your post </label>
            <select
              name="categories"
              multiple={true}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange(event, 'categories')
              }
            >
              {allCategories.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <FormField
            htmlFor="postImg"
            label=""
            name="postImg"
            type="hidden"
            value={formData.postImg}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(event, 'postImg')
            }
          />

          <ImageUploader onChange={handleFileUpload} postImg={formData.postImg || ''} />
          <button type="submit">Save as a Draft</button>
        </form>
      </div>
    </>
  )
}
