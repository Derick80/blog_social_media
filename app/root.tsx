import type { MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch } from '@remix-run/react'
import styles from './styles/app.css'

export const meta: MetaFunction = () => {
    const description = `See what I've been up to`
    return {
        charset: 'utf-8',
        description,
        title: 'New Remix App',
        viewport: 'width=device-width,initial-scale=1',
        keywords: 'remix,react,typescript, blog, prisma, postgresql',
    }
}


export function links () {
    return [{ rel: 'stylesheet', href: styles }]
}

function Document ({
    children,
    title = `My Personal Blog`,
}: {
    children: React.ReactNode
    title?: string
}) {
    return (
        <html lang="en" className='font-Condensed h-screen w-full dark:bg-zinc-700 dark:text-white'>
            <head>
                <Meta />
                <title>{ title }</title>
                <Links />
            </head>
            <body>
                { children }
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    )
}
export default function App () {
    return (
        <Document>
            <Outlet />
        </Document>
    )
}

export function CatchBoundary () {
    const caught = useCatch()

    return (
        <Document
            title={ `${caught.status} ${caught.statusText}` }
        >
            <div className="error-container">
                <h1>
                    { caught.status } { caught.statusText }
                </h1>
            </div>
        </Document>
    )
}
export function ErrorBoundary ({ error }: { error: Error }) {
    return (
        <Document title="Uh-oh!">
            <div className="error-container">
                <h1>App Error</h1>
                <pre>{ error.message }</pre>
            </div>
        </Document>
    )
}