import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData, useSearchParams, useTransition } from '@remix-run/react';
import React, { useEffect, useRef, useState } from 'react';
import Layout from '~/components/layout';
import FormField from '~/components/shared/form-field';
import { getUser, login, register } from '~/utils/auth.server';
import {
  validateEmail,
  validatePassword,
  validateText,
} from '~/utils/validators.server';

export const meta: MetaFunction = () => {
  return {
    title: `Derick's Personal Blog | Login`,
    description: `Login to Derick's Personal Blog`,
  };
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    action: string;
    email: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect('/') : null;
};
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get('_action');
  const email = form.get('email');
  const password = form.get('password');

  if (
    typeof action !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: 'Invalid form submission',
    });
  }

  const fields = { action, email, password };

  const fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
    action: validateText(action),
  };

  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (action) {
    case 'login': {
      return await login({ email, password });
    }
    case 'register': {
      return await register({ email, password });
    }
    default:
      return badRequest({ fields, formError: 'Invalid Login' });
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const transition = useTransition();

  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.fieldErrors || {});
  const [formError, setFormError] = useState(actionData?.fieldErrors || '');
  const [action, setAction] = useState('login');

  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || '',
    password: actionData?.fields?.password || '',
  });


  // const token = searchParams.get("token");
  // const redirectTo = searchParams.get("redirectTo");





  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };
  return (
    <>
      <div>
          <h2 >Welcome to my Blog</h2>
          <p >
            {action === 'login'
              ? 'Please Login to leave a comment on a Post'
              : 'Sign up to start commenting'}
          </p>
          <form method='post' className='form-primary' >
            <div >
              {formError}
            </div>
            {/* <input type="hidden" name="redirectTo" value={redirectTo || "/"} />
            <input type="hidden" name="token" value={token || ""} /> */}

            <FormField
              htmlFor='email'
              label='Email'
              value={formData.email}
              onChange={(event) => handleInputChange(event, 'email')}
              error={errors?.email}
            />
            <FormField
              htmlFor='password'
              label='Password'

              value={formData.password}
              type='password'
              onChange={(event) => handleInputChange(event, 'password')}
              error={errors?.password}
              autocomplete='new-password'
            />

            <div >
              <button type='submit' name='_action' value={action}>
                {action === 'login' ? `Login` : `Sign Up`}
              </button>
            </div>
          </form>
          <button
            onClick={() =>
              setAction(
                action == 'login'
                  ? `don't have an account? Sign up!`
                  : '' + 'in'
              )
            }
          >
            {action === 'login'
              ? `Don't have an account? Sign up!`
              : 'Already have an account? Sign In'}
          </button>{' '}
        </div>
    </>
  );
}
