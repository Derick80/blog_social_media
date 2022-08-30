import type {LoaderFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {Outlet, useLoaderData} from '@remix-run/react'
import AppBar from '~/components/appBar'
import Layout from '~/components/layout'
import {getUser} from '~/utils/auth.server'

type LoaderData = {
    user: { id: string; email: string };
    role: string;
    email: string;
    isOwner: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    const role = await process.env.ADMIN as string;
    const isOwner = user?.email === role;

    return json({  user, role,  isOwner});
};

export default function Home() {
    const { user, isOwner }: LoaderData = useLoaderData();
    return (
        <Layout>
            <AppBar user={user} isOwner={isOwner} />
            <Outlet />

        </Layout>
    );
}