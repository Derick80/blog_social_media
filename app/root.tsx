import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import spriteSrc from '~/sprites.svg'
import styles from './styles/app.css'
import { CatchBoundary, ErrorBoundary, Document } from './components/shared/errors'

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

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  )
}

export { ErrorBoundary, CatchBoundary }
