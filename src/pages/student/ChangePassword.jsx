import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

export default function ChangePassword() {
    const navigate = useNavigate()
    const { user, refreshUser } = useAuth()
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
    const [status, setStatus] = useState({ type: '', message: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.newPassword.length < 6) {
            setStatus({ type: 'error', message: 'New password must be at least 6 characters' })
            return
        }
        if (form.newPassword !== form.confirm) {
            setStatus({ type: 'error', message: 'Passwords do not match' })
            return
        }
        setLoading(true)
        setStatus({ type: '', message: '' })
        try {
            await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
            setStatus({ type: 'success', message: 'Password changed successfully. Redirecting...' })
            await refreshUser()
            setTimeout(() => navigate('/student/dashboard'), 1200)
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Unable to change password.' })
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return null
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Change Password</h1>
                <p className="mt-3 text-lg text-slate-400">Set a new password for your account.</p>
            </div>

            {status.message && (
                <div className={'mb-6 rounded-2xl border px-4 py-3 text-sm ' +
                    (status.type === 'success'
                        ? 'border-green-500/30 bg-green-500/10 text-green-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-300')
                }>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <label className="block text-sm text-slate-300">
                    <span className="mb-2 block">Current password</span>
                    <input
                        type="password"
                        value={form.currentPassword}
                        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                        placeholder="Current password"
                        required
                    />
                </label>
                <label className="block text-sm text-slate-300">
                    <span className="mb-2 block">New password</span>
                    <input
                        type="password"
                        value={form.newPassword}
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                        placeholder="New password"
                        required
                        minLength={6}
                    />
                </label>
                <label className="block text-sm text-slate-300">
                    <span className="mb-2 block">Confirm new password</span>
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
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save new password'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/student/dashboard')}
                        className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    )
}
