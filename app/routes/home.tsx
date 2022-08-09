import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import AppBar from "~/components/appBar";
import Layout from "~/components/layout";
import { getUser } from "~/utils/auth.server";

type LoaderData = {
  user: { id: string; email: string };
  adminEmail: string;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const adminEmail = await process.env.ADMIN;
  return json({
    user,
    adminEmail,
  });
};
export default function Home() {
  const { user, adminEmail }: LoaderData = useLoaderData();
  return (
    <Layout>
      <AppBar user={user} role={adminEmail} />
      <Outlet />
    </Layout>
  );
}
