import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { uploadImage } from "~/utils/s3.server";

export const action: ActionFunction = async ({ request }) => {
  // 2
  const imageUrl = await uploadImage(request);

  console.log("ts imageurl", { imageUrl });

  // 4
  return json({ imageUrl });
};
