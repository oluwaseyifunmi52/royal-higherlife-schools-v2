import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const demoUsers = [
    { role: 'student', label: 'Student', name: 'Ama Boateng', email: 'ama@example.com', path: '/student/dashboard' },
    { role: 'parent', label: 'Parent', name: 'Mr. Boateng', email: 'parent@example.com', path: '/parent/dashboard' },
    { role: 'teacher', label: 'Teacher', name: 'Mrs. Johnson', email: 'teacher@example.com', path: '/teacher/dashboard' },
    { role: 'bursar', label: 'Bursar', name: 'Mr. Agyeman', email: 'bursar@example.com', path: '/bursar/dashboard' },
    { role: 'admin', label: 'Admin', name: 'Principal Mensah', email: 'admin@example.com', path: '/admin/dashboard' },
]

export default function Login() {
    const { setUser } = useAuth()
    const navigate = useNavigate()

    const handleDemoLogin = (role, path) => {
        const selectedUser = demoUsers.find((entry) => entry.role === role)
        setUser({ role: selectedUser.role, name: selectedUser.name, email: selectedUser.email })
        navigate(path)
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Portal access</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">Choose a demo role to view the school portal for that user.</p>

                <div className="mt-8 space-y-3">
                    {demoUsers.map((entry) => (
                        <button
                            key={entry.role}
                            type="button"
                            onClick={() => handleDemoLogin(entry.role, entry.path)}
                            className="w-full rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-left font-semibold text-white transition hover:border-amber-400 hover:text-amber-300"
                        >
                            Continue as {entry.label}
                        </button>
                    ))}
                </div>

                <p className="mt-6 text-center text-sm text-slate-400">
                    New family? <Link to="/admission" className="font-semibold text-amber-400">Start admission</Link>
                </p>
            </div>
        </main>
    )
}
