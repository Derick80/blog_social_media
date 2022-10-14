import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import invariant from 'tiny-invariant'
import { ImageUploader } from '~/components/image-uploader'
import FormField from '~/components/shared/form-field'
import { getUser, getUserId } from '~/utils/auth.server'
import { getCategories } from '~/utils/categories.server'
import { deletePost, getPost, publishPost, savePost, unpublishPost } from '~/utils/post.server'
import {
  CategoryForm,

  FullCategoryListDestructure,
  QueriedPost,
  SinglePost,
} from '~/utils/types.server'
import { validateText } from '~/utils/validators.server'


type LoaderData = {
  reducedPost: SinglePost
  fullCategoryList: Awaited<ReturnType<typeof getCategories>>
  currentUser: string
  isLoggedIn: boolean
  postCategories: string[]
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request)
  invariant(user, 'User not Available')
  const isLoggedIn = user === null ? false : true
  const fullCategoryList = await getCategories()
  invariant(fullCategoryList, 'Categories not available')

  invariant(params.postId, `params.postId is required`)
  const currentUser = user.id
  invariant(currentUser, `currentUser is required`)

  const { reducedPost } = await getPost(params.postId)

  if (!reducedPost) {
    throw new Response('Post not found', { status: 404 })
  }

  const postCategories = reducedPost.selectedPostCategories.map((category) => {
    return category.value
  })

  console.log('postCategories', postCategories)

  const data: LoaderData = {
    reducedPost,
    isLoggedIn,
    fullCategoryList,
    currentUser,
    postCategories,
  }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request)
  const postId = params.postId
  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')
  const body = formData.get('body')
  const postImg = formData.get('postImg')
  const createdBy = formData.get('createdBy')
  const categories = formData.getAll('categories')
  const action = formData.get('_action')
  // reshape category form data for db
  const correctedCategories = categories.map((cat) => {
    return {
      name: cat,
    }
  }) as CategoryForm[]

  invariant(postId, 'No Post Id')

  if (!postId) {
    return json({ postId: null }, { status: 404 })
  }
  if (!userId) {
    throw new Response('You are not authorized to edit this post', {
      status: 401,
    })
  }
  if (
    typeof postId !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof body !== 'string' ||
    typeof userId !== 'string' ||
    typeof postImg !== 'string' ||
    typeof createdBy !== 'string' ||
    typeof categories !== 'object'
  ) {
    return json({ error: 'invalid form data category' }, { status: 400 })
  }

  const errors = {
    postId: validateText(postId),
    title: validateText(title as string),
    description: validateText(description as string),
    body: validateText(body as string),
    postImg: validateText(postImg as string),
    createdBy: validateText(createdBy as string),
  }

  if (Object.values(errors).some(Boolean))
    return json(
      {
        errors,
        fields: {
          postId,
          title,
          description,
          body,
          postImg,
          createdBy,
        },
        form: action,
      },
      { status: 400 }
    )

  switch (action) {
    case 'save':
      await savePost({ postId, title, description, body, postImg, correctedCategories })
      return redirect(`/posts/${postId}`)

    case 'publish':
      await publishPost(postId)
      return redirect(`/posts/${postId}`)
    case 'unpublish':
      await unpublishPost(postId)
      return redirect(`/posts/${postId}`)
    case 'delete':
      await deletePost(postId)
      return redirect(`/`)
  }

  return json({ error: 'invalid form data' }, { status: 400 })
}

export default function PostRoute() {

  const data = useLoaderData<LoaderData>()
  const actionData = useActionData()
  const [errors] = useState(actionData?.errors || {})
  const { reducedPost, postCategories } = data
  const { fullCategoryList } = data.fullCategoryList

  const [selected, setSelected] = useState<string[]>(postCategories)

  const [formData, setFormData] = useState({
    id: reducedPost.id,
    title: reducedPost.title,
    description: reducedPost.description,
    body: reducedPost.body,
    postImg: reducedPost.postImg,
    createdBy: reducedPost.createdBy,
    categories: postCategories,
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

  const handleSelectChanges = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    if (formData.categories.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        categories: prev.categories.filter((item: string) => item !== value),
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
    <>
      <div className="flex flex-col items-center">
        <h1 className="mt-6 text-3xl font-semibold tracking-wide">Edit Post</h1>
        <small className="text-sm italic">
          {' '}
          {reducedPost.published
            ? 'You are editing a published post'
            : 'you are editing a draft post'}
        </small>
        <form method="post" className="form-primary">
          <FormField
            htmlFor="id"
            label=""
            name="postId"
            type="hidden"
            value={formData.id}
            onChange={(event) => handleInputChange(event, 'postId')}
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
            error={errors?.description}
          />
          {actionData?.fieldErrors?.description ? (
            <p role="alert" id="description-error">
              {actionData.fieldErrors.description}
            </p>
          ) : null}
          <FormField
            htmlFor="body"
            label="Write Your Post"
            name="body"
            className="form-field-primary"
            value={formData.body}
            onChange={(event) => handleInputChange(event, 'body')}
            error={errors?.body}
          />
          <FormField
            htmlFor="postImg"
            label="Post Image"
            type="hidden"
            name="postImg"
            value={formData.postImg}
            onChange={(event) => handleInputChange(event, 'postImg')}
          />
          <div>
            <div className="mx-1 mt-2 mb-2 flex flex-wrap space-x-2 md:mt-4">
              {selected.map((item) => (
                <span
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      categories: prev.categories.filter(
                        (selectedItem: string) => selectedItem !== item
                      ),
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
              size={fullCategoryList.length}
              name="categories"
              value={formData.categories}
              onChange={(event) => handleSelectChanges(event)}
            >
              {fullCategoryList.map((item: FullCategoryListDestructure) => (
                <option className="" key={item.id} value={item.value}>
                  {item.value}
                </option>
              ))}
            </select>
          </div>
          <ImageUploader onChange={handleFileUpload} postImg={formData.postImg || ''} />
          <div className="flex flex-row items-center justify-between py-2 md:py-4">
            {reducedPost.published ? (
              <>
                <div></div>
                <button type="submit" name="_action" value="save">
                  Save Post
                </button>
                <button type="submit" name="_action" value="unpublish">
                  Unpublish
                </button>
              </>
            ) : (
              <>
                <div></div>
                <button type="submit" name="_action" value="save">
                  Save Draft
                </button>
                <button type="submit" name="_action" value="publish">
                  Publish draft
                </button>
              </>
            )}

            <button type="submit" name="_action" value="delete">
              {reducedPost.published ? 'Delete Post' : 'Delete Draft'}
            </button>

            <div></div>
          </div>
        </form>
      </div>
    </>
  )
}
