import type {LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {getUser} from '~/utils/auth.server'
import {getPosts} from '~/utils/post.server'
import ContentContainer from '~/components/shared/content-container'
import Posts from '~/components/posts'

type LoaderData = {
    user: { id: string; email: string };
    userPosts: Array<{
        id: string;
        title: string;
        body: string;
        email: string;
        postImg: string;
        published: boolean;
        categories: Array<{ id: string; name: string }>;
    }>;
    role: string;
    email: string;
    isOwner: boolean;

};
export const loader: LoaderFunction = async ({ request }) => {

    const user = await getUser(request);
    const role = await process.env.ADMIN;
    const isOwner = user?.email === role;

    const { userPosts } = await getPosts();

    const email = userPosts.map((email) => email.user.email);
    return json({ userPosts, user, role, email, isOwner });
};
export default function Home() {
    const { user, userPosts,  email, isOwner }: LoaderData = useLoaderData();
    return (
         <ContentContainer>
                <div className="text-base md:text-5xl font-extrabold">Posts</div>
                {userPosts.map((post) => (
                    <Posts key={post.id} posts={post} isOwner={isOwner}/>
                ))}
            </ContentContainer>

    );
}