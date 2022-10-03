import { Profile } from '@prisma/client'
import { Link } from '@remix-run/react'
import { QueriedUserProfile } from '~/utils/types.server'
import Button from './shared/button'
import blacktransparent from '../resources/logos/blacktransparent.png'
// look at history
export type ProfileProps = {
  data: {
    userProfile: QueriedUserProfile
    isOwner: boolean
    isLoggedIn: boolean
  }
}

export default function ProfileContent({ data }: ProfileProps) {
  return (
    <div key={data.userProfile.id} className="h-full">
      <div className="flex h-auto w-full object-contain">
        {' '}
        <img src={blacktransparent} alt="logo" width={100} height={100} />
      </div>
      <div>
        <h1 className="my-3 border-b-2 text-left text-3xl">
          {data.userProfile.firstName} {data.userProfile.lastName}{' '}
        </h1>
        <p className="text-sm italic"> {data.userProfile.title}</p>

        <div className="flex flex-row gap-5">
          <div className="h-1/2 w-1/2">
            {' '}
            <img src={data.userProfile.profilePicture} alt="profile" />
          </div>
          <div>
            <div>About Me</div>
            <div>{data.userProfile.bio}</div>
          </div>
        </div>
        <div></div>
        {data.isOwner ? (
          <Link to={`/about/${data.userProfile.id}`} className="flex">
            <button type="button" className="btn-primary">
              Edit
            </button>
          </Link>
        ) : null}
      </div>
    </div>
  )
}
