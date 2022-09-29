import { Profile } from '@prisma/client'
import { Link } from '@remix-run/react'
import Button from './shared/button'
import Tooltip from './shared/tooltip'

export type ProfileProps = {
  userProfile: Profile
  isOwner: boolean
}

export default function ProfileContent({ userProfile, isOwner }: ProfileProps) {
  return (
    <div key={userProfile.id} className="">
      <div>
        <h1 className="my-3 border-b-2 text-left text-3xl">
          {userProfile.firstName} {userProfile.lastName}{' '}
        </h1>
        <p className="text-sm italic"> {userProfile.title}</p>

        <div className="flex flex-row gap-5">
          <div className="h-1/2 w-1/2">
            {' '}
            <img src={userProfile.profilePicture} alt="profile" />
          </div>
          <div>
            <div>About Me</div>
            <div>{userProfile.bio}</div>
          </div>
        </div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path d="M28.1 21.8h13.4v-9.3H28.1Zm6.75-1.85L29.6 16v-2l5.2 3.95L40 14v2ZM3 42q-1.2 0-2.1-.9Q0 40.2 0 39V9q0-1.2.9-2.1Q1.8 6 3 6h42q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm26.55-3H45V9H3v30h.35q2.2-3.45 5.625-5.45t7.475-2q4.05 0 7.475 2T29.55 39Zm-13.1-11q2.5 0 4.25-1.75T22.45 22q0-2.5-1.75-4.25T16.45 16q-2.5 0-4.25 1.75T10.45 22q0 2.5 1.75 4.25T16.45 28Zm-9.3 11h18.6q-1.8-2.1-4.225-3.275Q19.1 34.55 16.45 34.55q-2.65 0-5.075 1.175Q8.95 36.9 7.15 39Zm9.3-14q-1.25 0-2.125-.875T13.45 22q0-1.3.875-2.15Q15.2 19 16.45 19q1.3 0 2.15.85.85.85.85 2.15 0 1.25-.85 2.125T16.45 25ZM24 24Z" />{' '}
            <a href="mailto:derickchoskinson@gmail.com">Email me..</a>
          </svg>
        </div>
        {isOwner ? (
          <Tooltip message="Edit Profile">
            <Link to={`/about/${userProfile.id}`}>
              <Button type="button" variant="primary">
                Edit
              </Button>
            </Link>
          </Tooltip>
        ) : null}
      </div>
    </div>
  )
}
