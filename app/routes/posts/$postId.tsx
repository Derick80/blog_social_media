import type { Post } from '@prisma/client'
import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import { getUser, getUserId } from '~/utils/auth.server'
import { getPost } from '~/utils/post.server'
import { validateText } from '~/utils/validators.server'


type LoaderData = {
    post: Post
    isOwner: boolean
}
export const loader: LoaderFunction = async ({ params, request }) => {
    // 2
    let userId = await getUserId(request)
    const user = await getUser(request)

    const postId = params.postId as string

    if (typeof postId !== 'string') {
        return redirect('/')
    }

    let post = userId ? await getPost({ id : postId, userId }) : null
    if (!post) {
        throw new Response('Post not found', { status : 404 })
    }
    let data: LoaderData = { post, isOwner : userId == post.userId }
    return json({ data, user })
}

export const action: ActionFunction = async ({ request, params }) => {
    const postId = params.postId as string
    const userId = await getUserId(request)
    let formData = await request.formData()
    const id = formData.get('id')
    let title = formData.get('title')
    let body = formData.get('body')
    if (
        typeof id !== 'string' ||
        typeof title !== 'string' ||
        typeof body !== 'string' ||
        typeof userId !== 'string'
    ) {
        return json({ error : 'invalid form data' }, { status : 400 })
    }

    const errors = {
        title : validateText(title as string),

        body : validateText(body as string)
    }

    if (Object.values(errors).some(Boolean))
        return json({
                errors,
                fields : {
                    title,
                    body
                },
                form : action

            },
            { status : 400 })
}
export default function PostRoute() {
    const { data, user } = useLoaderData()
    const actionData = useActionData()
    const [errors, setErrors] = useState(actionData?.errors || {})
    console.log(actionData)
    const [formData, setFormData] = useState({
        id : data.post.id,
        title : data.post.title,
        body : data.post.body

    })
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLFormElement>,
        field: string
    ) => {
        setFormData((form) => ({
            ...form,
            [field] : event.target.value
        }
        ))
    }
    return (
        <>
            <form method='post' className='text-xl font-semibold'>
                <FormField
                    htmlFor='id'
                    label=''
                    name='id'
                    type='hidden'
                    value={ formData.id }
                    onChange={ (event: any) => handleInputChange(event, 'id') }
                    error={ errors?.id }
                />
                <FormField
                    htmlFor='title'
                    label='title'
                    name='title'
                    value={ formData.title }
                    onChange={ (event: any) => handleInputChange(event, 'title') }
                    error={ errors?.title }
                />
                <FormField
                    htmlFor='body'
                    label='Account Number'
                    name='body'
                    type='number'
                    value={ formData.body }
                    onChange={ (event: any) => handleInputChange(event, 'body') }
                    error={ errors?.body }
                />


                <div className='w-full text-container'>
                    <button type='submit'>Save</button>
                </div>
            </form>
        </>
    )
}
