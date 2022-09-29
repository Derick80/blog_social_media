import { NavLink } from '@remix-run/react'
import React from "react";
import chevron_left from '../../public/assets/icons/chevron_left.png'
export default function Sidebar() {
  return (
    <div className="h-screen w-70 rounded-md bg-gray-600">
      <div className="px-6 pt-8">
        <div className="flex items-center justify-between">
            <img src={chevron_left} alt="chevron_left" className="absolute cursor-pointer-right-3 top-9 w-7 border-2 border-green-400" />
        <NavLink
                to="/"
                className={({ isActive }) => ` ${isActive ? 'underline' : ''}`}
              >
                  <span className="material-symbols-outlined">home</span>
                <p className="hidden md:block">Feed</p>
              </NavLink>
        </div>
      </div>
    </div>
  );
}
