import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi'

const linksByRole = {
    student: [
        { to: '/student/dashboard', label: 'Dashboard' },
        { to: '/student/classes', label: 'Classes' },
        { to: '/student/assignments', label: 'Assignments' },
        { to: '/student/quizzes', label: 'Quizzes' },
        { to: '/student/payments', label: 'My Fees' },
        { to: '/student/payment-history', label: 'Payments' },
        { to: '/student/report', label: 'Report Card' },
        { to: '/student/library', label: 'Library' },
    ],
    teacher: [
        { to: '/teacher/dashboard', label: 'Dashboard' },
        { to: '/teacher/classes', label: 'My Classes' },
        { to: '/teacher/attendance', label: 'Attendance' },
        { to: '/teacher/report-scores', label: 'Results' },
        { to: '/teacher/assignments', label: 'Assignments' },
        { to: '/teacher/quizzes', label: 'Quizzes' },
        { to: '/teacher/submissions', label: 'Submissions' },
        { to: '/teacher/resources', label: 'Materials' },
        { to: '/teacher/meetings', label: 'Meetings' },
    ],
    parent: [
        { to: '/parent/dashboard', label: 'Dashboard' },
        { to: '/parent/progress', label: 'Child Progress' },
        { to: '/parent/payments', label: 'Payments' },
        { to: '/parent/payment-history', label: 'History' },
        { to: '/parent/report', label: 'Report Card' },
    ],
    admin: [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/staff', label: 'Staff Management' },
        { to: '/admin/students', label: 'Students' },
        { to: '/admin/teachers', label: 'Teachers' },
        { to: '/admin/classes', label: 'Classes' },
        { to: '/admin/subjects', label: 'Subjects' },
        { to: '/admin/results', label: 'Results' },
        { to: '/admin/attendance', label: 'Attendance' },
        { to: '/admin/awards', label: 'Awards' },
        { to: '/admin/certificates', label: 'Certificates' },
        { to: '/admin/payments', label: 'Payments' },
        { to: '/admin/gallery', label: 'Gallery' },
        { to: '/admin/announcements', label: 'Announcements' },
        { to: '/admin/admissions', label: 'Admissions' },
        { to: '/admin/settings', label: 'Settings' },
    ],
    bursar: [
        { to: '/bursar/dashboard', label: 'Dashboard' },
        { to: '/bursar/students', label: 'Students' },
        { to: '/bursar/fees', label: 'School Fees' },
        { to: '/bursar/record-payment', label: 'Payments' },
        { to: '/bursar/payment-history', label: 'Payment History' },
        { to: '/bursar/cash-report', label: 'Cash Report' },
        { to: '/bursar/reports', label: 'Fee Reports' },
        { to: '/bursar/profile', label: 'My Profile' },
    ],
}

export default function SchoolNavbar() {
    const { user, logout } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)
    const links = linksByRole[user?.role] || []

    if (!user) return null

    return (
        <nav className="border-b border-slate-800 bg-slate-900/90 sticky top-0 z-40">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-white">
                        <span className="text-amber-400 uppercase tracking-wider text-xs">{user.role}</span>
                        <span className="ml-2 hidden sm:inline">{user.name || user.firstName || 'Portal'}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="rounded-full border border-slate-700 p-2 text-slate-200 lg:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle navigation"
                >
                    {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </button>

                <div className="hidden lg:flex items-center gap-1 text-sm text-slate-300">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `rounded-full px-3 py-1.5 transition-colors ${isActive ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'hover:text-white hover:bg-slate-800'}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                    <button
                        onClick={logout}
                        className="ml-2 flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1.5 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                    >
                        <FiLogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="border-t border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
                    <div className="flex flex-wrap gap-2 text-sm text-slate-300">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-full px-3 py-2 transition-colors ${isActive ? 'bg-amber-500/15 text-amber-400 font-semibold' : 'hover:text-white hover:bg-slate-800'}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <button
                            onClick={() => { logout(); setMobileOpen(false) }}
                            className="flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-2 text-slate-400 hover:text-red-400 transition-colors"
                        >
                            <FiLogOut size={14} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
