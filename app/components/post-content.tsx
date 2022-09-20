import { Link } from '@remix-run/react'
import { SerializedPost } from '~/utils/types.server'
import CategoryContainer from './category-container'
import Sectionheader from './shared/section-header'


type PostProps = {
    post: SerializedPost
}

export default function PostContent ({ post }: PostProps) {
    return (
        <article>post-content

            <Link

                to={ `/posts/${post.id}` }
            >
                <Sectionheader>{ post.title }</Sectionheader>
                <hr />

                { post?.categories?.map((category) => (
                    <CategoryContainer
                        key={ category.id }
                        category={ category } />
                )) }
                <div>
                    <img
                        style={ {
                            backgroundSize: "cover",
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
