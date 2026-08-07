import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../services/authService'

export default function ResetPassword() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [form, setForm] = useState({ password: '', confirm: '' })
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password.length < 6) {
            setStatus({ type: 'error', message: 'Password must be at least 6 characters' })
            return
        }
        if (form.password !== form.confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match' })
            return
        }
        setLoading(true)
        setStatus({ type: '', message: '' })
        try {
            const res = await resetPassword(token, form.password)
            setStatus({ type: 'success', message: res.data?.message || 'Password reset successful' })
            setTimeout(() => navigate('/login'), 1200)
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Reset failed. The link may be invalid or expired.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Password reset</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Reset your password</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                    Enter a new password for your account.
                </p>

                {status.message && (
                    <div className={'mt-4 rounded-2xl border px-4 py-3 text-sm ' +
                        (status.type === 'success'
                            ? 'border-green-500/30 bg-green-500/10 text-green-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300')
                    }>
                        {status.message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">New password</span>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="Enter new password"
                            required
                            minLength={6}
                        />
                    </label>
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Confirm password</span>
                        <input
                            type="password"
                            value={form.confirm}
                            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            placeholder="Confirm new password"
                            required
                            minLength={6}
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset password'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    <Link to="/login" className="font-semibold text-amber-400">Back to login</Link>
                </p>
            </div>
        </main>
    )
}
