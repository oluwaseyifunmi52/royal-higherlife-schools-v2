import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const roleRoutes = {
    student: '/student/dashboard',
    teacher: '/teacher/dashboard',
    bursar: '/bursar/dashboard',
    parent: '/parent/dashboard',
    admin: '/admin/dashboard',
}

const options = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'bursar', label: 'Bursar' },
    { value: 'admin', label: 'Admin' },
]

const createAccountLink = {
    teacher: { label: 'Create Teacher Account', to: '/teacher/register' },
    bursar: { label: 'Create Bursar Account', to: '/bursar/register' },
    admin: { label: 'Create Admin Account', to: '/admin/register' },
}

export default function Login() {
    const { login, loginAsStudent } = useAuth()
    const navigate = useNavigate()
    const [loginType, setLoginType] = useState('student')
    const [admissionNumber, setAdmissionNumber] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (loginType === 'student') {
                if (!admissionNumber || !password) {
                    setError('Admission number and password are required')
                    return
                }
                const result = await loginAsStudent(admissionNumber, password)
                if (result.mustChangePassword) {
                    navigate('/student/change-password')
                } else {
                    navigate('/student/dashboard')
                }
            } else {
                // Teacher, Bursar and Admin all authenticate by email + password.
                // The role is ALWAYS resolved from the backend (MongoDB) — the
                // selected button only decides which form fields to show.
                if (!email || !password) {
                    setError('Email and password are required')
                    return
                }
                const userData = await login(email, password)
                const dest = roleRoutes[userData.role] || '/login'
                if (loginType === 'admin' && userData.role !== 'admin') {
                    setError('This account is not an admin account.')
                    return
                }
                navigate(dest)
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const isStudent = loginType === 'student'
    const createLink = createAccountLink[loginType]

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">School portal</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Welcome back</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                    Sign in to your Royal Higherlife Schools portal account.
                </p>

                {error && (
                    <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2 rounded-full border border-slate-700 bg-slate-950 p-1">
                    {options.map((opt) => {
                        const active = loginType === opt.value
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { setLoginType(opt.value); setError('') }}
                                className={
                                    'flex-1 rounded-full py-2.5 text-sm font-semibold transition-colors ' +
                                    (active
                                        ? 'bg-amber-500 text-slate-950'
                                        : 'text-slate-400 hover:text-white')
                                }
                            >
                                {opt.label}
                            </button>
                        )
                    })}
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {isStudent ? (
                        <label className="block text-sm text-slate-300">
                            <span className="mb-2 block">Admission Number</span>
                            <input
                                type="text"
                                value={admissionNumber}
                                onChange={(e) => setAdmissionNumber(e.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                                placeholder="e.g. RHS-2026-001"
                                required
                            />
                        </label>
                    ) : (
                        <label className="block text-sm text-slate-300">
                            <span className="mb-2 block">Email</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                                placeholder="you@example.com"
                                required
                            />
                        </label>
                    )}

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Password</span>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                                placeholder="Your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-slate-400">
                    <Link to="/login/forgot" className="font-semibold text-amber-400 hover:text-amber-300">Forgot password?</Link>
                </p>

                {createLink && (
                    <p className="mt-6 text-center text-sm text-slate-400">
                        Don&apos;t have an account?{' '}
                        <Link to={createLink.to} className="font-semibold text-amber-400 hover:text-amber-300">{createLink.label}</Link>
                    </p>
                )}

                {loginType === 'admin' && (
                    <p className="mt-2 text-center text-xs text-slate-500">
                        Admin creation requires an authorization setup code.
                    </p>
                )}

                {isStudent && (
                    <p className="mt-6 text-center text-sm text-slate-400">
                        New family? <Link to="/admission" className="font-semibold text-amber-400">Start admission</Link>
                    </p>
                )}
            </div>
        </main>
    )
}
