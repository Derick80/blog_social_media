import { NavLink } from '@remix-run/react'
import Tooltip from '~/components/shared/tooltip'

export default function AppBar() {
  return (
    <>
      <nav className='w-full p-2 mt-2 font-semibold uppercase flex flex-wrap mx-auto text-center justify-around'>
        <Tooltip message='View Posts'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              ` ${
                isActive
                  ? 'uppercase underline text-sm md:text-xl'
                  : 'uppercase text-sm md:text-xl'
              }`
            }
          >
            Blog Feed
          </NavLink>
        </Tooltip>
        <Tooltip message='My Profile'>
          <NavLink
            to='/about'
            className={({ isActive }) =>
              ` ${
                isActive
                  ? 'uppercase underline text-sm md:text-xl'
                  : 'uppercase text-sm md:text-xl'
              }`
            }
          >
            About
          </NavLink>
        </Tooltip>
      </nav>
    </>
  )
}
