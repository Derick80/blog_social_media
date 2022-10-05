import { Link } from '@remix-run/react'
import Document from './document'
export interface ErrorBoxProps {
  message?: string
  error: Error
}

export default function ErrorBox({ error, message }: ErrorBoxProps) {
  return (
    <Document title="Error!">
      <h1 className="text-4xl">{error.message}</h1>
      <p className="text-lg">Something went wrong!</p>
      {message && <p className="text-lg">{message}</p>}
      <Link to="/" className="rounded bg-red-600 px-8 py-2 text-white">
        Go back to home
      </Link>
    </Document>
  )
}
