import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Footer from "~/components/footer";
import Layout from "~/components/shared/layout";
import { getUser } from "~/utils/auth.server";

export const meta: MetaFunction = () => ({
  title: `Derick's Personal Blog Feed`,
  description: `See what I've been up to lately`,
});
type LoaderData = {
  isLoggedIn: boolean;
  firstName: string;
  userRole: string;
};
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const isLoggedIn = user === null ? false : true;
  const firstName = user?.firstName || "Guest";
  const userRole = user?.role || "USER";
  const data: LoaderData = {
    isLoggedIn,
    firstName,
    userRole,
  };
  return json(data);
};

export default function Home() {
  const data = useLoaderData<LoaderData>();
  return (
    <Layout data={data}>
      <Outlet />
      <Footer />
    </Layout>
  );
}
