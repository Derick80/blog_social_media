import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  return (request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
