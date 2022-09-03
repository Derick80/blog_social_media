import { ReactNode } from 'react'

export default function Sectionheader({ children }: { children: ReactNode }) {
  return (
    <div className='text-base md:text-3xl font-extrabold uppercase underline'>
      {children}
    </div>
  )
}
