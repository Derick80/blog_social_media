import { json, LoaderFunction } from '@remix-run/node'
import { Outlet, useLoaderData } from '@remix-run/react'
import AppBar from '~/components/appBar'
import Layout from '~/components/layout'
import { getUser } from '~/utils/auth.server'

type LoaderData = {
    user: Array<{ id: string, email: string }>

}
export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request)

    return json({
        user
    })
}
export default function Home() {
    const { user }: LoaderData = useLoaderData()
    return (
        <Layout>
            <AppBar user={ user }/>
            <Outlet/>
        </Layout>
    )
}
