import type {LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {Link, useLoaderData} from '@remix-run/react'
import React from 'react'
import ContentContainer from '~/components/shared/content-container'
import Icon from '~/components/shared/icon'
import Tooltip from '~/components/shared/tooltip'
import {getUser, requireUserId} from '~/utils/auth.server'
import {getPosts} from '~/utils/post.server'

type LoaderData = {
  user: { id: string; email: string };
  userPosts: Array<{
    id: string;
    title: string;
    body: string;
    email: string;
    postImg: string;
  }>;
  role: string;
  email: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const role = await process.env.ADMIN;

  const { userPosts } = await getPosts();

  const email = userPosts.map((email) => email.user.email);
  return json({ userPosts, user, role, email });
};

export default function HomeRoute() {
  const { user, userPosts, role, email }: LoaderData = useLoaderData();

  return (
    <ContentContainer>
      <div className="text-base md:text-5xl font-extrabold">Posts</div>
      {userPosts.map((post) => (
        <div
          key={post.id}
          className="w-full rounded-xl shadow-2xl text-xl shadow-grey-300 p-2 md:w-1/2 md:mt-4 md:mb-4"
        >
          <div className="flex flex-row">
            <h1 className="text-2xl my-6 border-b-2 text-center md:text-3xl">
              {post.title}
            </h1>
          </div>
          <div className="flex flex-col-reverse items-center p-2 md:flex md:flex-row md:p-2 md:space-x-10">
            <img
              className="object-contain w-1/2 rounded"
              src={post.postImg}
              alt="profile"
            />
            <div className="text-base md:text-2xl">{post.body}</div>
          </div>

          {user ? (
            <div className="flex flex-row justify-between p-2">
              {user.email === role ? (
                <>
                  <Tooltip message="Edit Post">
                    <Link to={post.id} className="text-red-600 underline">
                      <Icon icon="edit" />
                    </Link>
                  </Tooltip>
                </>
              ) : (
                <div className="flex flex-row justify-between p-2"></div>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </ContentContainer>
  );
}
