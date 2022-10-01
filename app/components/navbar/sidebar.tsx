import { NavLink } from '@remix-run/react'
import React from 'react'
import contact_mail from '../../resources/icons/contact_mail.svg'
export default function Sidebar() {
  return (
    <header>
      <div className="px-6 pt-8">
        <div className="flex items-center justify-between">
          <svg
            className="cursor-pointer-right-3 absolute top-9 w-7 border-2 border-green-400"
            xmlns="http://www.w3.org/2000/svg"
            height="48"
            width="48"
          >
            <path d="M8 42V18L24.1 6 40 18v24H28.3V27.75h-8.65V42Zm3-3h5.65V24.75H31.3V39H37V19.5L24.1 9.75 11 19.5Zm13-14.65Z" />

            <NavLink to="/" className={({ isActive }) => ` ${isActive ? 'underline' : ''}`}>
              <span className="material-symbols-outlined">home</span>
              <p className="hidden md:block">Feed</p>
            </NavLink>
          </svg>
        </div>
      </div>
    </header>
  )
}
