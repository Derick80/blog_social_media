import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getUser, requireUserId } from '~/utils/auth.server'
import { createLike, deleteLike } from '~/utils/like.server'


export const loader: LoaderFunction = () => {
  throw notFound({ message: "This page doesn't exists." });
};

export const action: ActionFunction = async ({ request, params }) => {
const user= await getUser(request)
 const postId = params.pid;
  const userId = user?.id as string;


  if (!userId || !postId){
    return json({ error: "invalid form data publish" }, { status: 400 });
  }
  try {
    if (request.method === "POST") {
      await createLike(userId, postId );
    }

    if (request.method === "DELETE") {
      await deleteLike({ userId, postId });
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: "invalid form data publish" }, { status: 400 });
  }

};