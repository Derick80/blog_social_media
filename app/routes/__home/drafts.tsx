import type {ActionFunction, LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useActionData, useLoaderData} from '@remix-run/react'
import React from 'react'
import ContentContainer from '~/components/shared/content-container'
import {getUser, requireUserId} from '~/utils/auth.server'
import {getUserDrafts} from '~/utils/post.server'
import Posts from '~/components/posts'

type LoaderData = {
  user: { email: string };
  userDrafts: {
    id: string;
    title: string;
    body: string;
    postImg: string;
    published: boolean;
    categories: Array<{ id: string; name: string }>;

  }
  id: string;

    role: string;
  isOwner: boolean;

};
export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const user = await getUser(request);
  const role = await process.env.ADMIN;
const isOwner = user?.email === role;
  const userDrafts  = await getUserDrafts(userId);


  return json({     userDrafts,
    user,
     isOwner });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

};
export default function Drafts() {
  const {     userDrafts,

     isOwner } = useLoaderData();
  const actionData = useActionData();



  return (
    <ContentContainer>
      <div className="text-base md:text-5xl font-extrabold">Drafts</div>

      {userDrafts.map((posts: typeof userDrafts) => (
          <Posts key={posts.id} posts={posts} isOwner={isOwner}  isPost={false} />
      ))}
    </ContentContainer>
  );
}

// to={`/__home/${post.id}`}

// to={post.id}
