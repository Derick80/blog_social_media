import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import React, { useState } from 'react'
import FormField from '~/components/shared/form-field'
import { getUser, login, register } from '~/utils/auth.server'
import {
  validateEmail,
  validatePassword,
  validateText
} from '~/utils/validators.server'

export const meta: MetaFunction = () => {
  return {
    title: `Derick's Personal Blog | Login`,
    description: `Login to Derick's Personal Blog`
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

  if (
    typeof action !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: 'Invalid form submission'
    })
  }

  const fields = { action, email, password }

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
    action: validateText(action)
  }

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields })

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
  const [formError] = useState(actionData?.fieldErrors || '')
  const [errors] = useState(actionData?.fieldErrors || {})
  const [action, setAction] = useState('login')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData(form => ({
      ...form,
      [field]: event.target.value
    }))
  }
  return (
    <>
      <div className='w-full flex flex-col items-center'>
        <h2 className='text-5xl font-extrabold'>Welcome to my bank</h2>
        <p className='text-2xl font-semibold'>
          {action === 'login'
            ? 'Please Login to leave a comment on a Post'
            : 'Sign up to start commenting'}
        </p>
        <form method='post' className='md:text-xl font-semibold'>
          <div className='text-xs font-semibold text-center tracking-wide text-red-500 w-full'>
            {formError}
          </div>
          <FormField
            className='border'
            htmlFor='email'
            label='Email'
            labelClass='text-2xl font-semibold my-2 px-2'
            value={formData.email}
            onChange={event => handleInputChange(event, 'email')}
            error={errors?.email}
          />
          <FormField
            className='border'
            htmlFor='password'
            label='Password'
            labelClass='text-2xl font-semibold my-2 px-2'
            value={formData.password}
            type='password'
            onChange={event => handleInputChange(event, 'password')}
            error={errors?.password}
            autocomplete='current-password'
          />

          <div className='w-full text-center'>
            <button type='submit' name='_action' value={action}>
              {action === 'login' ? 'Please log in' : 'Sign up'}
            </button>
          </div>
        </form>
        <button
          onClick={() => setAction(action == 'login' ? 'register' : '' + 'in')}
          className='rounded-xl dark:bg-light-blue font-semibold px-3 py-2 transition duration-300 ease-in-out hover:dark:bg-light-orange-400'
        >
          {action === 'login' ? 'Register' : 'Sign In'}
        </button>{' '}
      </div>
    </>
  )
}
