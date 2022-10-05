import { Links, LiveReload, Meta, Scripts, ScrollRestoration } from '@remix-run/react'

export default function Document({
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
        {title ? <title>{title}</title> : null} <Links />
      </head>
      <body className="font-Condensed dark:bg-gray-700 dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}{' '}
      </body>
    </html>
  )
}
