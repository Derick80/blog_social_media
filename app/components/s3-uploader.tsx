import type { ActionFunction, UploadHandler } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";

import { s3UploadHandler } from "~/utils/s3.server";

type ActionData = {
  errorMsg?: string;
  postImg?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    s3UploadHandler,
    createMemoryUploadHandler()
  );
  const formData = await parseMultipartFormData(request, uploadHandler);
  const postImg = formData.get("postImg");
  if (!postImg) {
    return json({
      errorMsg: "Something went wrong while uploading",
    });
  }
  return json({
    postImg,
  });
};

export default function Uploader() {
  const fetcher = useFetcher<ActionData>();
  return (
    <>
      <fetcher.Form method="post" encType="multipart/form-data">
        <label htmlFor="postImg">Image to upload</label>
        <input id="postImg" type="file" name="postImg" accept="image/*" />

        <button type="submit">Upload to S3</button>
      </fetcher.Form>
      {fetcher.type === "done" ? (
        fetcher.data.errorMsg ? (
          <h2>{fetcher.data.errorMsg}</h2>
        ) : (
          <>
            <div>
              File has been uploaded to S3 and is available under the following
              URL (if the bucket has public access enabled):
            </div>
            <div>{fetcher.data.postImg}</div>
            <img src={fetcher.data.postImg} alt={"Uploaded image from S3"} />
          </>
        )
      ) : null}
    </>
  );
}
