import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import { ImageUploader } from '~/components/image-uploader'
import Button from '~/components/shared/button'
import FormField from '~/components/shared/form-field'
import { getUser, getUserId } from '~/utils/auth.server'
import { getCategories } from '~/utils/categories.server'
import {
  deletePost,
  getPost,
  publishPost,
  unpublishPost,
  updateAndPublish,
  updatePost,
} from '~/utils/post.server'
import { validateText } from '~/utils/validators.server'

type LoaderData = {
  post: {
    id: string
    description: string
    title: string
    body: string
    postImg: string
    published: boolean
    user: {
      email: string
    }
    categories: Array<{ id: string; name: string }>
  }
  categories: Array<{ id: string; name: string }>
  catResults: Array<{ id: string; name: string }>

  allCategories: Array<{ id: string; name: string }>

  postId: string
  currentUser: string
  isLoggedIn: boolean
}

// const badRequest = (data: ActionData) => {
//   json(data, { status: 400 })
// }
export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = (await getUserId(request)) as string
  const user = await getUser(request)
  const isLoggedIn = user === null ? false : true
  const { allCategories } = await getCategories()

  const postId = params.postId
  const currentUser = user?.id as string

  if (!postId) {
    return json({ postId: null }, { status: 404 })
  }
  const post = userId ? await getPost({ id: postId }) : null
  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }
  const email = post.user.email
  if (email != user?.email) {
    throw new Response('You are not authorized to edit this post', {
      status: 401,
    })
  }
  const categories = post.categories.map((category) => category)

  const catResults = allCategories.map((category) => {
    const cat = categories.find((cat) => cat.id == category.id)
    if (cat) {
      return { ...category, checked: true }
    } else {
      return { ...category, checked: false }
    }
  })

  const data: LoaderData = {
    post,
    isLoggedIn,
    postId,
    categories,
    allCategories,
    catResults,
    currentUser,
  }
  return json({
    data,
  })
}

export const action: ActionFunction = async ({ request }) => {
  const userId = (await getUserId(request)) as string
  const formData = await request.formData()
  const id = formData.get('id')
  const title = formData.get('title')
  const description = formData.get('description')
  const body = formData.get('body')
  const postImg = formData.get('postImg')
  const createdBy = formData.get('createdBy') as string
  const categories = formData.getAll('categories') as []

  const action = formData.get('_action')
  const converted = categories.map((category) => {
    return { name: category }
  })
  if (!userId) {
    throw new Response('You are not authorized to edit this post', {
      status: 401,
    })
  }
  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof body !== 'string' ||
    typeof userId !== 'string' ||
    typeof postImg !== 'string'
  ) {
    return json({ error: 'invalid form data category' }, { status: 400 })
  }

  const errors = {
    title: validateText(title as string),
    description: validateText(description as string),
    body: validateText(body as string),
    postImg: validateText(postImg as string),
  }
  switch (action) {
    case 'save':
      if (Object.values(errors).some(Boolean))
        return json(
          {
            errors,
            fields: {
              title,
              description,
              body,
            },
            form: action,
          },
          { status: 400 }
        )

      await updatePost({
        id,
        userId,
        title,
        description,
        body,
        postImg,
        createdBy,
        categories: converted,
      })
      return redirect(`/`)
    case 'updateAndPublish':
      if (
        typeof id !== 'string' ||
        typeof title !== 'string' ||
        typeof description !== 'string' ||
        typeof body !== 'string' ||
        typeof userId !== 'string' ||
        typeof postImg !== 'string'
      ) {
        return json({ error: 'invalid form data update and publhs' }, { status: 400 })
      }

      await updateAndPublish({
        id,
        userId,
        title,
        description,
        body,
        postImg,
        createdBy,
        categories: converted,
      })
      console.log('update and publish', id);

      return redirect(`/`)
    case 'publish':
      if (typeof id !== 'string') {
        return json({ error: 'invalid form data publish' }, { status: 400 })
      }
      await publishPost(id)
      console.log('published');

      return redirect('/')
    case 'unpublish':
      if (typeof id !== 'string') {
        return json({ error: 'invalid form data unpublish' }, { status: 400 })
      }
      await unpublishPost(id)
      return redirect('/drafts')
    case 'delete':
      if (typeof id !== 'string') {
        return json({ error: 'invalid form data delete' }, { status: 400 })
      }
      await deletePost(id)
      return redirect('/')

    default:
      throw new Error('Unexpected action')
  }
}
export default function PostRoute() {
  const { data, categories } = useLoaderData()
  const actionData = useActionData()
  const [errors] = useState(actionData?.errors || {})

  const [formData, setFormData] = useState({
    id: data.post.id,
    title: data.post.title,
    description: data.post.description,
    body: data.post.body,
    postImg: data.post.postImg,
    createdBy: data.post.createdBy,
    categories: data.catResults || categories,
  })

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }))
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
      <div className="flex flex-col items-center">
        <h1 className="mt-6 text-3xl font-semibold tracking-wide">Edit Post</h1>
        <small className="text-sm italic">
          {' '}
          {data.post?.published
            ? 'You are editing a published post'
            : 'you are editing a draft post'}
        </small>
        <form method="post" className="form-primary">
          <FormField
            htmlFor="id"
            label=""
            name="id"
            type="hidden"
            value={formData.id}
            onChange={(event) => handleInputChange(event, 'id')}
            error={errors?.id}
          />{' '}
          <FormField
            htmlFor="createdBy"
            label=""
            name="createdBy"
            type="hidden"
            value={formData.createdBy}
            onChange={(event) => handleInputChange(event, 'createdBy')}
            error={errors?.createdBy}
          />{' '}
          <FormField
            htmlFor="title"
            label="Title"
            name="title"
            type="textarea"
            value={formData.title}
            onChange={(event) => handleInputChange(event, 'title')}
            error={errors?.title}
          />
          <FormField
            htmlFor="description"
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(event) => handleInputChange(event, 'description')}
            aria-invalid={Boolean(actionData?.fieldErrors?.description) || undefined}
            aria-errormessage={
              actionData?.fieldErrors?.description ? 'description-error' : undefined
            }
          />
          {actionData?.fieldErrors?.description ? (
            <p role="alert" id="description-error">
              {actionData.fieldErrors.description}
            </p>
          ) : null}

            <label>
              <FormField
                htmlFor="body"
                label="Write Your Post"
                name="body"
                className="form-field-primary"
                value={formData.body}
                onChange={(event) => handleInputChange(event, 'body')}
                aria-invalid={Boolean(actionData?.fieldErrors?.body) || undefined}
                aria-errormessage={actionData?.fieldErrors?.body ? 'body-error' : undefined}
              />
            </label>

          <FormField
            htmlFor="postImg"
            label=""
            name="posImg"
            value={formData.postImg}
            onChange={(event) => handleInputChange(event, 'postImg')}
          />{' '}
          <div>
            <label>Tag your post </label>

            <select
              name="categories"
              multiple={true}
              className="form-field-primary"
              onChange={(event) => handleInputChange(event, 'categories')}
            >
              {data.catResults.map((option) => (
                <option
                  key={option.id}
                  value={option.name}
                  selected={option.checked ? true : false}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <ImageUploader onChange={handleFileUpload} postImg={formData.postImg || ''} />
          <div className="flex flex-row items-center justify-between py-2 md:py-4">
            {data?.post?.published ? (
              <>
                <div></div>
                <Button type="submit" name="_action" value="save">
                  Update Post
                </Button>
                <Button type="submit" name="_action" value="unpublish" variant="solid_warning">
                  Unpublish
                </Button>
              </>
            ) : (
              <>
                <div></div>
                <Button type="submit" name="_action" value="save">
                  Update Draft
                </Button>
                <Button type="submit" name="_action" value="updateAndPublish">
                  Publish draft
                </Button>
              </>
            )}

            <Button type="submit" name="_action" value="delete" variant="solid_danger">
              {data.post?.published ? 'Delete Post' : 'Delete Draft'}
            </Button>

            <div></div>
          </div>
        </form>
      </div>
    </>
  )
}
