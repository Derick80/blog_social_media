import type { ActionFunction, LoaderFunction, MetaFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import { getUser, login, register } from '~/utils/auth.server'
import { validateEmail, validatePassword, validateText } from '~/utils/validators.server'

export const meta: MetaFunction = () => {
  return {
    title: `Derick's Personal Blog | Login`,
    description: `Login to Derick's Personal Blog`,
  }
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    email: string | undefined
    password: string | undefined
  }
  fields?: {
    action: string
    email: string
    password: string
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 })

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect('/') : null
}
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const action = form.get('_action')
  const email = form.get('email')
  const password = form.get('password')

  if (typeof action !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return badRequest({
      formError: 'Invalid form submission',
    })
  }

  const fields = { action, email, password }

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
    action: validateText(action),
  }

  if (Object.values(fieldErrors).some(Boolean)) return badRequest({ fieldErrors, fields })

  switch (action) {
    case 'login': {
      return await login({ email, password })
    }
    case 'register': {
      return await register({ email, password })
    }
    default:
      return badRequest({ fields, formError: 'Invalid Login' })
  }
}

export default function Login() {
  const actionData = useActionData<ActionData>()

  const [errors, setErrors] = useState(actionData?.fieldErrors || {})
  const [formError, setFormError] = useState(actionData?.fieldErrors || '')
  const [action, setAction] = useState('login')

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }))
  }
  return (
    <>
      <div className="mx-auto  w-1/4 p-2">
        <button
          onClick={() => setAction(action == 'login' ? 'register' : 'login')}
          className="absolute top-8 right-8 rounded-md bg-green-600 p-2 text-center font-semibold uppercase text-white"
        >
          {action === 'login' ? 'Sign Up' : 'Sign In'}
        </button>
        <h2 className="pb-2 text-center text-xl font-semibold">Welcome to my Blog</h2>
        <p className="pb-2 text-center text-sm italic">
          {action === 'login'
            ? 'Please Login to leave a comment on a Post'
            : 'Sign up to start commenting'}
        </p>
        <form method="post" className="form-primary">
          <div>{formError}</div>

          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(event) => handleInputChange(event, 'email')}
            error={errors?.email}
          />
          <FormField
            htmlFor="password"
            label="Password"
            value={formData.password}
            type="password"
            onChange={(event) => handleInputChange(event, 'password')}
            error={errors?.password}
            autocomplete="new-password"
          />

          <div>
            <button
              className="w-full rounded-md bg-green-600 p-2 text-center uppercase text-white"
              type="submit"
              name="_action"
              value={action}
            >
              {action === 'login' ? `Login` : `Sign Up`}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
