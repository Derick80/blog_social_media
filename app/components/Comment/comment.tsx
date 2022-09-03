import { User } from '@prisma/client'

export type CommentProps = {
  comment: {
    id: string
    message: string
    user: User[]
    createdAt: string
  }
}

export default function Comment({ comment }: CommentProps) {
  return <></>
}
