import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import logo from '../assets/school logo.jpeg'


const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/academics', label: 'Academics' },
    { to: '/admission', label: 'Admissions' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <NavLink to="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-white">
                    <img
                        src={logo}
                        alt="Royal Higherlife Schools logo"
                        className="h-12 w-12 rounded-full border border-slate-700 object-cover shadow-sm"
                    />
                    <span>
                        Royal Higherlife Schools
                        <span className="block text-xs font-normal text-slate-400">Excellence, Knowledge & Integrity</span>
                    </span>
                </NavLink>

                <button
                    type="button"
                    className="rounded-full border border-slate-700 p-2 text-slate-200 md:hidden"
                    onClick={() => setOpen((value) => !value)}
                    aria-label="Toggle navigation"
                >
                    {open ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>

                <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive ? 'text-yellow-400' : 'hover:text-white'
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <NavLink
                        to="/login"
                        className="rounded-full border border-blue-400/50 px-4 py-2 text-blue-300 hover:bg-blue-500 hover:text-white"
                    >
                        Portal
                    </NavLink>
                </nav>
            </div>

            {open ? (
                <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
                    <nav className="flex flex-col gap-3 text-sm font-medium text-slate-300">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    isActive ? 'text-yellow-400' : 'hover:text-white'
                                }
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <NavLink
                            to="/login"
                            className="rounded-full border border-blue-400/50 px-4 py-2 text-center text-blue-300"
                            onClick={() => setOpen(false)}
                        >
                            Portal
                        </NavLink>
                    </nav>
                </div>
            ) : null}
        </header>
    )
}
