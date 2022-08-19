import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { publishPost } from "~/utils/post.server";

export const action: ActionFunction = async ({ request }) => {
  // 2
  const postId = await publishPost(request);

  console.log("ts postId", { postId });

  // 4
  return json({ postId });
};
