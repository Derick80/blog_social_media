import { NavLink } from '@remix-run/react'
import Button from '../shared/button'

type PrimaryNavProps = {
  data: {
    isLoggedIn: boolean
    firstName: string
    userRole: string
  }
}
export default function NavigationBar({ data }: PrimaryNavProps) {
  return (
    <header className="w-full md:p-2">
      <nav className="flex flex-col items-center md:flex-row">
        <NavLink to="/" className="mb-2 flex items-center md:mb-0">
          <svg
            width="309.3484"
            height="28.8518"
            x="958.8258"
            y="714.4655"
            version="1.1"
            preserveAspectRatio="none"
            viewBox="0.64 -28.6 310.08 28.92"
          >
            <g transform="matrix(1 0 0 1 0 0)" className="fill-black text-base dark:fill-white">
              <path
                id="id-D6z1nYkh15"
                d="M0.64-28.24L5.60-28.24L13.72-4.88L21.88-28.24L26.84-28.24L16.64 0L10.80 0L0.64-28.24Z M49.24 0L47.08-6.12L35.16-6.12L33 0L28.12 0L38.52-27.80L43.76-27.80L54.12 0L49.24 0ZM36.44-9.64L45.80-9.64L41.12-22.84L36.44-9.64Z M77.48 0L72.36 0L65.32-11.28L62.08-11.28L62.08 0L57.52 0L57.52-28.24L67.48-28.24Q72.32-28.24 74.82-25.88Q77.32-23.52 77.32-19.64L77.32-19.64Q77.32-16.32 75.46-14.20Q73.60-12.08 70.08-11.48L70.08-11.48L77.48 0ZM62.08-24.32L62.08-14.52L67.12-14.52Q72.64-14.52 72.64-19.40L72.64-19.40Q72.64-21.72 71.30-23.02Q69.96-24.32 67.12-24.32L67.12-24.32L62.08-24.32Z M81.44-28.24L86-28.24L86 0L81.44 0L81.44-28.24Z M110.52 0L108.36-6.12L96.44-6.12L94.28 0L89.40 0L99.80-27.80L105.04-27.80L115.40 0L110.52 0ZM97.72-9.64L107.08-9.64L102.40-22.84L97.72-9.64Z M116.64-28.24L136.96-28.24L136.96-24.56L129.08-24.56L129.08 0L124.48 0L124.48-24.56L116.64-24.56L116.64-28.24Z M140.36-28.24L144.92-28.24L144.92 0L140.36 0L140.36-28.24Z M163.52-28.60Q167.44-28.60 170.62-26.76Q173.80-24.92 175.62-21.62Q177.44-18.32 177.44-14.16L177.44-14.16Q177.44-10 175.62-6.70Q173.80-3.40 170.62-1.54Q167.44 0.32 163.52 0.32L163.52 0.32Q159.56 0.32 156.38-1.54Q153.20-3.40 151.36-6.70Q149.52-10 149.52-14.16L149.52-14.16Q149.52-18.32 151.36-21.62Q153.20-24.92 156.38-26.76Q159.56-28.60 163.52-28.60L163.52-28.60ZM163.52-24.36Q160.80-24.36 158.68-23.12Q156.56-21.88 155.38-19.56Q154.20-17.24 154.20-14.16L154.20-14.16Q154.20-11.08 155.38-8.76Q156.56-6.44 158.68-5.20Q160.80-3.96 163.52-3.96L163.52-3.96Q166.20-3.96 168.30-5.20Q170.40-6.44 171.58-8.76Q172.76-11.08 172.76-14.16L172.76-14.16Q172.76-17.24 171.58-19.56Q170.40-21.88 168.30-23.12Q166.20-24.36 163.52-24.36L163.52-24.36Z M204.88-28.20L204.88 0L200.32 0L186.60-20.84L186.60 0L182.04 0L182.04-28.20L186.60-28.20L200.32-7.28L200.32-28.20L204.88-28.20Z M224.32-28.24L224.32-3.56L234.08-3.56L234.08 0L219.76 0L219.76-28.24L224.32-28.24Z M237.64-28.24L242.20-28.24L242.20 0L237.64 0L237.64-28.24Z M271.48-27.80L277-27.80L277 0L272.40 0L272.40-20.84L264.36 0L260.36 0L252.28-20.84L252.28 0L247.72 0L247.72-27.80L253.24-27.80L262.44-5.60L271.48-27.80Z M282.48-28.24L287.04-28.24L287.04 0L282.48 0L282.48-28.24Z M290.40-28.24L310.72-28.24L310.72-24.56L302.84-24.56L302.84 0L298.24 0L298.24-24.56L290.40-24.56L290.40-28.24Z"
              />
            </g>
          </svg>
        </NavLink>
        {/* added w-full to ul to get them to spread out and then I had to remove the class from my tooltip and place it in the lis */}
        <ul className="nav-ul">
          <NavLink to="/" className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}>
            <li className="nav-li">
              <span className="material-symbols-outlined">home</span>
            </li>
            <p className="hidden md:block">Feed</p>
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}>
            <li className="nav-li">
              <span className="material-symbols-outlined">info</span>
            </li>
            <p className="hidden md:block">About</p>
          </NavLink>
          {data.userRole === 'ADMIN' ? (
            <>
              <NavLink
                to="/posts/new"
                className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}
              >
                <li className="nav-li">
                  <span className="material-symbols-outlined">add_circle</span>
                </li>
                <p className="hidden md:block">Create</p>
              </NavLink>
              <NavLink
                to="/drafts"
                className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}
              >
                <li className="nav-li">
                  <span className="material-symbols-outlined">drafts</span>
                </li>
                <p className="hidden md:block">Drafts</p>
              </NavLink>
            </>
          ) : null}

          {data.isLoggedIn ? (
            <>
              <NavLink
                to="/account"
                className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}
              >
                <li className="nav-li">
                  <span className="material-symbols-outlined">settings</span>
                </li>
                <p className="hidden md:block">Settings</p>
              </NavLink>
              <li className="nav-li text-xs md:text-base">
                <p>{data.firstName}</p>

                <span>Welcome</span>
              </li>

              <li className="nav-li">
                <form className="" action="/logout" method="post">
                  <Button type="submit">
                    {' '}
                    <span className="material-symbols-outlined">logout</span>
                  </Button>
                  <p className="hidden md:block">Sign Out</p>
                </form>
              </li>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => ` ${isActive ? 'border-b-2' : ''}`}>
                <li className="nav-li">
                  <span className="material-symbols-outlined">login</span>
                  <p className="hidden md:block">To Like or Comment Please Sign In</p>
                </li>
              </NavLink>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}
