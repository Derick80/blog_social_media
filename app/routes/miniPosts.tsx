import { json, LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { requireUserId } from '~/utils/auth.server'
import { getMiniPosts } from '~/utils/postv2.server'


export const loader: LoaderFunction = async ({ request }) => {
const userId = await requireUserId(request)
    const miniPosts = await getMiniPosts()

    if(!miniPosts) {
        throw new Error('No Mini Posts')
    }

    const data = {
        miniPosts

    }

    return json(data)

}

export default function MiniPostsIndex() {

    const data = useLoaderData()
return(
    <div>
        <h1>Mini Posts</h1>
        {data.miniPosts.map((miniPost) => {

            return(
                <div key={miniPost.id}>
                    <Link to={`/miniPosts/${miniPost.id}`}>{miniPost.title}</Link>
                    <p>{miniPost.body}</p>
                </div>
            )

        }
        )}
    </div>


)
}