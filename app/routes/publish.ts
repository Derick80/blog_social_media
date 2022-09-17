import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { publishPost } from "~/utils/post.server";

export const action: ActionFunction = async ({ request }) => {
  const postId = await publishPost(request);

  return json({ postId });
};
