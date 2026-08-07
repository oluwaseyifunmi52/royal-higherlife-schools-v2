import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminRegister() {
    const { registerAdmin } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', setupCode: '' })
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ type: '', message: '' })
        const { firstName, lastName, email, password, confirm, setupCode } = form
        if (!firstName || !lastName || !email || !password || !setupCode) {
            setStatus({ type: 'error', message: 'All fields are required.' })
            return
        }
        if (password.length < 8) {
            setStatus({ type: 'error', message: 'Password must be at least 8 characters.' })
            return
        }
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            setStatus({ type: 'error', message: 'Password must contain at least one letter and one number.' })
            return
        }
        if (password !== confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match.' })
            return
        }
        setLoading(true)
        try {
            const user = await registerAdmin({ firstName, lastName, email, password, setupCode })
            setStatus({ type: 'success', message: 'Admin account created successfully.' })
            navigate('/admin/dashboard')
        } catch (err) {
            setStatus({
                type: 'error',
                message: err.response?.data?.message || 'Admin account creation failed. Please try again.',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Admin setup</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Admin Registration</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                    Creating an Admin account is protected. You need an authorization setup code that is
                    configured by the school. The backend always assigns the Admin role — it can never be chosen.
                </p>

                {status.message && (
                    <div
                        className={
                            'mt-4 rounded-2xl border px-4 py-3 text-sm ' +
                            (status.type === 'success'
                                ? 'border-green-500/30 bg-green-500/10 text-green-300'
                                : 'border-red-500/30 bg-red-500/10 text-red-300')
                        }
                    >
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block text-sm text-slate-300">
                            <span className="mb-2 block">First Name</span>
                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                                placeholder="John"
                                required
                            />
                        </label>
                        <label className="block text-sm text-slate-300">
                            <span className="mb-2 block">Last Name</span>
                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                                placeholder="Adewale"
                                required
                            />
                        </label>
                    </div>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Email</span>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="you@example.com"
                            required
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Password</span>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="Min 8 characters, letters & numbers"
                            required
                            minLength={8}
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Confirm Password</span>
                        <input
                            type="password"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="Confirm password"
                            required
                            minLength={8}
                        />
                    </label>

                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Setup Code</span>
                        <input
                            type="text"
                            name="setupCode"
                            value={form.setupCode}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="Provided by school administration"
                            required
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                    >
                        {loading ? 'Creating admin...' : 'Create Admin Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Not an Admin?{' '}
                    <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300">Back to login</Link>
                </p>
            </div>
        </main>
    )
}
