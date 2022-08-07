import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { requireUserId } from '~/utils/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  let user = await requireUserId(request)
  if (user) {
    return redirect('/home')
  }
  return redirect('/login')
}
