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
import spriteSrc from '~/sprites.svg'
import styles from './styles/app.css'
import { StylesPlaceholder } from '@mantine/remix'
import { createEmotionCache, MantineProvider } from '@mantine/core'
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

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preload', href: spriteSrc, as: 'image' },
]

createEmotionCache({ key: 'mantine' })
function Document({
  children,
  title = `My Personal Blog`,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <html lang="en">
        <head>
          <StylesPlaceholder />
          <Meta />
          {title ? <title>{title}</title> : null} <Links />
        </head>
        <body className="overflow-scroll font-Condensed dark:bg-gray-700 dark:text-white">
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </MantineProvider>
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
        <h1>CatchBoundry root</h1>
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
