import type { LinksFunction, MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react'
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

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
    { rel: 'email_contact', href: '../public/icons/contact_mail.png', type: "image/png", },
    {rel: 'chevron_left', href:'../public/assets/icons/chevron_left.png'},
    {rel: "preload", href: "../public/assets/icons/contact_mail.svg", as: "image", type: "image/svg+xml"},
  ]
}

function Document({
  children,
  title = `My Personal Blog`,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body className="max-h-screen w-full font-Condensed dark:bg-gray-700 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <div>
        <h1>CatchBoundry</h1>
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  )
}
export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Uh-oh!">
      <div className="bg-white text-black dark:bg-slate-500 dark:text-white">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  )
}

// h-screen dark:bg-gray-700 dark:text-white
