import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, useActionData, useCatch, useLoaderData, useParams } from '@remix-run/react'
import React, { useState } from 'react'
import { ImageUploader } from '~/components/image-uploader'
import FormField from '~/components/shared/form-field'
import Tooltip from '~/components/shared/tooltip'
import { getUser, getUserId } from '~/utils/auth.server'
import {
  deletePost,
  getPost,
  likePost,
  publishPost,
  removeCategoryFromPost,
  unpublishPost,
  updateAndPublish,
  updatePost,
} from '~/utils/post.server'
import { validateText } from '~/utils/validators.server'
import CategoryContainer from '~/components/category-container'
import Sectionheader from '~/components/shared/section-header'
import { getCategories } from '~/utils/categories.server'

type LoaderData = {
  post: {
    id: string
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

  isPublished: boolean
  postId: string
}

// const badRequest = (data: ActionData) => {
//   json(data, { status: 400 })
// }
export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = (await getUserId(request)) as string
  const user = await getUser(request)
  const { allCategories } = await getCategories()

  const postId = params.postId as string

  const post = userId ? await getPost({ id: postId, userId }) : null
  if (!post) {
    throw new Response('Post not found', { status: 404 })
  }
  const isPublished = post.published
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

  const data = {
    post,
    isPublished,
    postId,
    categories,
    allCategories,
    catResults,
  }
  return json({
    data,
    user,
    isPublished,
    categories,
    allCategories,
    catResults,
  })
}

export const action: ActionFunction = async ({ request, params }) => {
  const postId = params.postId as string
  const userId = (await getUserId(request)) as string
  const formData = await request.formData()
  const id = formData.get('id')
  const currentUser = formData.get('currentUser')
  const published = formData.get('published')
  const title = formData.get('title')
  const body = formData.get('body')
  const postImg = formData.get('postImg')
  const categories = formData.getAll('categories') as []

  const action = formData.get('_action')
  const converted = categories.map((category) => {
    return { name: category }
  })
  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof body !== 'string' ||
    typeof userId !== 'string' ||
    typeof postImg !== 'string' ||
    typeof categories !== 'object'
  ) {
    return json({ error: 'invalid form data category' }, { status: 400 })
  }

  const errors = {
    title: validateText(title as string),

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
        body,
        postImg,
        categories: converted,
      })
      return redirect(`/${id}`)
    case 'updateAndPublish':
      if (
        typeof id !== 'string' ||
        typeof title !== 'string' ||
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
        body,
        postImg,
        categories: converted,
      })
      return redirect(`/`)
    case 'publish':
      if (typeof id !== 'string') {
        return json({ error: 'invalid form data publish' }, { status: 400 })
      }
      await publishPost(id)
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
      return redirect('drafts')
    // case 'removeCategory':
    //   if (typeof id !== 'string') {
    //     return json({
    //       error: 'invalid form data removeCategory'
    //     })
    //   }
    //   await removeCategoryFromPost(postId,

    //     )

    // return redirect(`/edit/${id}`)
    case 'likePost':
      if (typeof postId !== 'string' || typeof currentUser !== 'string') {
        return json({ error: 'invalid form data likePost' }, { status: 400 })
      }
      await console.log(postId, currentUser)
      return
    default:
      throw new Error('Unexpected action')
  }
}
export default function PostRoute() {
  const { data, isPublished, categories, allCategories, catResults } = useLoaderData()
  console.log(isPublished)
  const actionData = useActionData()
  const [errors] = useState(actionData?.errors || {})

  const [formData, setFormData] = useState({
    id: data.post.id,
    title: data.post.title,
    body: data.post.body,
    published: data.post.published,
    postImg: data.post.postImg,
    categories: actionData?.fields?.categories || [],
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
      <div>
        <Sectionheader>Make changes to your post</Sectionheader>

        {isPublished ? (
          <> You are editing a published post</>
        ) : (
          <> You are editing an unpublished Draft</>
        )}
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
            htmlFor="title"
            label="Title"
            name="title"
            type="textarea"
            value={formData.title}
            onChange={(event) => handleInputChange(event, 'title')}
            error={errors?.title}
          />
          <p>
            <label>
              Content
              <textarea
                name="body"
                value={formData.body}
                onChange={(event: any) => handleInputChange(event, 'body')}
              />
            </label>
          </p>
          <FormField
            htmlFor="postImg"
            label="Image"
            labelClass="uppercase"
            name="postImg"
            value={formData.postImg}
            onChange={(event) => handleInputChange(event, 'postImg')}
          />{' '}
          <div>
            <label>Tag your post </label>

            <select
              name="categories"
              multiple={true}
              onChange={(event) => handleInputChange(event, 'categories')}
            >
              {catResults.map((option) => (
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
          <CategoryContainer categories={categories} isPost={true} />
          {formData.published ? (
            <>
              <div>
                <Tooltip message="Unpublish this post">
                  <button type="submit" name="_action" value="unpublish">
                    UnPublish
                  </button>
                </Tooltip>
                <Tooltip message="Delete this post">
                  <button type="submit" name="_action" value="delete">
                    Delete
                  </button>
                </Tooltip>
                <div>
                  <Tooltip message="Save and Publish">
                    <button type="submit" name="_action" value="save">
                      Save Post
                    </button>
                  </Tooltip>
                </div>
              </div>
            </>
          ) : (
            <div>
              <Tooltip message="Save as a draft">
                <button type="submit" name="_action" value="save">
                  Save Post Draft
                </button>
              </Tooltip>
              <Tooltip message="Save and Publish">
                <button type="submit" name="_action" value="updateAndPublish">
                  Save and Publish Post
                </button>
              </Tooltip>
              <Tooltip message="Delete this post">
                <button type="submit" name="_action" value="delete">
                  Delete
                </button>
              </Tooltip>
              <div>
                <Tooltip message="Publish">
                  <button type="submit" name="_action" value="publish" className="">
                    <span className="material-symbols-outlined">save</span>
                  </button>
                </Tooltip>
                <Tooltip message="Delete this category">
                  <button type="submit" name="_action" value="removeCategory">
                    Delete
                  </button>
                </Tooltip>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 401) {
    return (
      <div>
        <p>You must be logged in to edit a post.</p>
        <Link to="/login">Login</Link>
      </div>
    )
  }
}
export function ErrorBoundary() {
  const { postId } = useParams()
  return <div>{`There was an error loading the post you requested ${postId}. Sorry.`}</div>
}
