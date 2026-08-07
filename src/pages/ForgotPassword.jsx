import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword } from '../services/authService'

export default function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            setStatus({ type: 'error', message: 'Please enter your email address' })
            return
        }
        setLoading(true)
        setStatus({ type: '', message: '' })
        try {
            const res = await forgotPassword(email)
            const data = res.data || {}
            setSent(true)
            setStatus({ type: 'success', message: data.message || 'If the account exists, a reset email has been sent.' })
            if (data.resetToken) {
                setTimeout(() => navigate('/reset-password/' + data.resetToken), 800)
            }
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Something went wrong. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Password reset</p>
                <h1 className="mt-3 text-3xl font-semibold text-white">Forgot your password?</h1>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                    Enter your email below and we will send you instructions to reset your password.
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

                {!sent && (
                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send reset link'}
                        </button>
                    </form>
                )}

                <p className="mt-6 text-center text-sm text-slate-400">
                    <Link to="/login" className="font-semibold text-amber-400">Back to login</Link>
                </p>
            </div>
        </main>
    )
}
