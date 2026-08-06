import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linksByRole = {
    student: [
        { to: '/student/dashboard', label: 'Dashboard' },
        { to: '/student/classes', label: 'Classes' },
        { to: '/student/assignments', label: 'Assignments' },
        { to: '/student/report', label: 'Report Card' },
    ],
    teacher: [
        { to: '/teacher/dashboard', label: 'Dashboard' },
        { to: '/teacher/lessons', label: 'Lessons' },
        { to: '/teacher/quizzes', label: 'Quizzes' },
        { to: '/teacher/analytics', label: 'Analytics' },
    ],
    parent: [
        { to: '/parent/dashboard', label: 'Dashboard' },
        { to: '/parent/progress', label: 'Child Progress' },
        { to: '/parent/report', label: 'Report Card' },
    ],
    admin: [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/admissions', label: 'Admissions' },
        { to: '/admin/settings', label: 'Settings' },
    ],
}

export default function SchoolNavbar() {
    const { user } = useAuth()
    const links = linksByRole[user?.role] || []

    return (
        <nav className="border-b border-slate-800 bg-slate-900/90">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <div className="text-lg font-semibold text-white">{user?.name || 'Portal'}</div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-300">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'text-amber-400' : 'hover:text-white')}>
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    )
}
