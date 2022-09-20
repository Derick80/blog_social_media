import { Link } from '@remix-run/react'
import { SerializedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'
import Sectionheader from './shared/section-header'


type PostProps = {
    post: SerializedPost
}

export default function PostContent ({ post }: PostProps) {
    return (
        <article>

            <Link

                to={ `/posts/${post.id}` }
            >
                <h1 className="my-6 border-b-2 text-center text-3xl">{ post.title }</h1>
                <hr />

                { post?.categories?.map((category) => (
                    <CategoryContainer
                        key={ category.id }
                        category={ category } />
                )) }
                <div className='flex'>
                    <img
                        style={ {
                            backgroundSize: "cover",
                            width: "50%",
                            aspectRatio: "auto",
                            ...(post.postImg
                                ? { backgroundImage: `url(${post.postImg})` }
                                : {}),
                        } }
                        src={ post.postImg }
                        alt="profile"
                    />
                    <p>{ post.body }</p>
                </div>
            </Link>
            <footer>

            </footer>
        </article>
    )
}
