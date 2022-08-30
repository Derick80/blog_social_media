import Tooltip from '~/components/shared/tooltip'
import {Link} from '@remix-run/react'
import Icon from '~/components/shared/icon'

type PostsProps = {
    posts: {
        id: string;
        title: string;
        body: string;
        email: string;
        postImg: string;
    }
    isOwner: boolean;


}
export default function Posts({posts, isOwner}: PostsProps) {

    return(
        <div
            key={posts.id}
            className="w-full rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 md:w-1/2 md:mt-4 md:mb-4"
        >
            <div className="flex flex-row">
                <h1 className="text-2xl my-6 border-b-2 text-center md:text-3xl">
                    {posts.title}
                </h1>
            </div>
            <div className="flex flex-col-reverse items-center p-2 md:flex md:flex-row md:p-2 md:space-x-10">
                <img
                    className="object-contain w-1/2 rounded"
                    src={posts.postImg}
                    alt="profile"
                />
                <div className="text-base md:text-2xl">{posts.body}</div>
            </div>

            {isOwner ? (
  <Tooltip message="Edit Post">
                        <Link to={`/${posts.id}`} className="text-green-600 dark:text-white">
                            <Icon icon="edit_document" />
                        </Link>
                    </Tooltip>

            ) : null               }
        </div>
    )
}