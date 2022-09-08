import { ReactNode } from 'react'

export default function Sectionheader({ children }: { children: ReactNode }) {
  return (
    <p className='text-base md:text-3xl font-extrabold uppercase underline'>
      {children}
    </p>
  )
}
