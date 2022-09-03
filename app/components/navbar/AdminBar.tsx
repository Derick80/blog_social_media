import { NavLink } from '@remix-run/react'
import Icon from '../shared/icon'
import Tooltip from '../shared/tooltip'

export default function AdminBar() {
  return (
    <nav className='w-full p-2 mt-2 font-semibold uppercase flex flex-wrap mx-auto text-center justify-around'>
      <Tooltip message='View posts'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            ` ${
              isActive
                ? 'underline text-base md:text-xl'
                : 'uppercase text-base md:text-xl'
            }`
          }
        >
          Blog Feed
        </NavLink>
      </Tooltip>

      <Tooltip message='Write a new blog post'>
        <NavLink
          to='/new'
          className={({ isActive }) =>
            ` ${
              isActive
                ? 'uppercase underline text-base md:text-xl'
                : 'uppercase text-base md:text-xl'
            }`
          }
        >
          Write a New Post
        </NavLink>
      </Tooltip>
      <Tooltip message='View drafts'>
        <NavLink
          to='/drafts'
          className={({ isActive }) =>
            ` ${
              isActive
                ? 'uppercase underline text-base md:text-xl'
                : 'uppercase text-base md:text-xl'
            }`
          }
        >
          Drafts
        </NavLink>
      </Tooltip>
      <Tooltip message='My Profile'>
        <NavLink
          to='/about'
          className={({ isActive }) =>
            ` ${
              isActive
                ? 'uppercase underline text-base md:text-xl'
                : 'uppercase text-base md:text-xl'
            }`
          }
        >
          About
        </NavLink>
      </Tooltip>
      <form action='/logout' method='post' className='flex flex-col'>
        <Tooltip message='signout'>
          <button
            type='submit'
            className='flex flex-row items-center rounded-xl bg-red-500 font-semibold justify-items-center text-white-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1'
          >
            SignOut
          </button>
        </Tooltip>
      </form>
    </nav>
  )
}
