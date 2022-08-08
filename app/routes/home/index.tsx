import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import Layout from "~/components/layout";
import { getUser } from "~/utils/auth.server";

type LoaderData = {
  user: Array<{ id: string; email: string }>;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json({
    user,
  });
};
export default function HomeRoute() {
  const { user }: LoaderData = useLoaderData();
  return <Layout></Layout>;
}
