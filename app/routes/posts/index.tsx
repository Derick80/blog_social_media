import { json, LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { getUser, requireUserId } from '~/utils/auth.server'
import { getPosts } from '~/utils/post.server'

type LoaderData = {

	userPosts: Array<{ id: string, title: string, body: string }>

}
export const loader: LoaderFunction = async ({ request }) => {
	const userId = await requireUserId(request)
	const user = await getUser(request)

	const { userPosts } = await getPosts(userId)
	return json(
		{ userPosts }
	)
}

export default function Posts() {
	const { userPosts }: LoaderData = useLoaderData()
	return (
		<main className='h-full items-center flex flex-col gap-y-4 mx-auto max-w-4xl'>
			<div className='text-5xl font-extrabold'>Posts</div>
			<>
				{ userPosts.map((post) => (
					<div key={ post.id } className='w-1/2 flex flex-col shadow-lg p-2'>
						<div className='flex flex-row'>
							<h1 className='my-6 border-b-2 text-center text-3xl'>{ post.title }</h1>

						</div>

						<div className='flex flex-row p-2 my-3'>  { post.body }</div>
						<div className='flex flex-row justify-between p-2'>
                            <span className='material-symbols-outlined'>
                                add_comment
                            </span>
							<Link
								to={ post.id }
								className='text-blue-600 underline'
							>
								<span className='material-symbols-outlined'>edit</span>


							</Link>
						</div>
					</div>
				)) }
			</>
		</main>
	)
}