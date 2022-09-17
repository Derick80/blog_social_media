import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import AppBar from "~/components/navbar/appBar";
import Layout from "~/components/layout";
import { getUser } from "~/utils/auth.server";

export const meta: MetaFunction = () => ({
  title: `Derick's Personal Blog Feed`,
  description: `See what I've been up to lately`,
});


export default function Home() {
  return (
    <Layout >
      <Outlet />
    </Layout>
  );
}

export function ErrorBoundary() {
  return <div>Uh oh something is really wrong with the __home loader. Try again later!</div>;
}
