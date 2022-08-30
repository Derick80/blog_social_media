import type {MetaFunction} from '@remix-run/node'
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from '@remix-run/react'
import styles from './styles/app.css'

export const meta: MetaFunction = () => ({
    charset : 'utf-8',
    title : 'New Remix App',
    viewport : 'width=device-width,initial-scale=1',
        keywords : 'remix,react,typescript, blog, prisma, postgresql',
}
)

export function links() {
    return [{ rel : 'stylesheet', href : styles }]
}

export default function App() {
    return (
        <html lang='en' className='font-Condensed h-screen w-full dark:bg-zinc-700 dark:text-white'
        >
        <head>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    )
}
