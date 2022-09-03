import type { ReactNode } from 'react'
import AppBar from './appBar'

export interface IContent {
  children?: ReactNode
  isOwner?: boolean
}

export default function ContentContainer({ children }: IContent) {
  return (
    <div className='w-full flex flex-col items-center'>
      <AppBar />
      {children}
    </div>
  )
}
