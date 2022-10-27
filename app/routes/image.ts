import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { uploadImage } from "~/utils/s3.server";

export const action: ActionFunction = async ({ request }) => {
  const imageUrl = await uploadImage(request);

  return json({ imageUrl });
};
