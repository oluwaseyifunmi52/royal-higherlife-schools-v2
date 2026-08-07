import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBursarProfile, updateBursarProfile } from '../../services/bursarService'

export default function BursarProfile() {
    const [profile, setProfile] = useState(null)
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getBursarProfile()
                const data = res.data?.data || res.data
                setProfile(data)
                setForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    profilePhoto: data.profilePhoto || '',
                })
            } catch (err) {
                setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to load profile.' })
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setStatus({ type: '', message: '' })
        try {
            const res = await updateBursarProfile({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                profilePhoto: form.profilePhoto,
            })
            const data = res.data?.data || res.data
            setProfile(data)
            setStatus({ type: 'success', message: 'Profile updated successfully.' })
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update profile.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-slate-400">Loading profile...</p>
            </main>
        )
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Bursar portal</p>
                    <h1 className="mt-2 text-3xl font-semibold text-white">My Profile</h1>
                    <p className="mt-3 text-lg text-slate-400">View and update your profile information.</p>
                </div>
                <Link
                    to="/bursar/dashboard"
                    className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    Back to Dashboard
                </Link>
            </div>

            {status.message && (
                <div
                    className={
                        'mb-6 rounded-2xl border px-4 py-3 text-sm ' +
                        (status.type === 'success'
                            ? 'border-green-500/30 bg-green-500/10 text-green-300'
                            : 'border-red-500/30 bg-red-500/10 text-red-300')
                    }
                >
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">First Name</span>
                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName || ''}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            required
                        />
                    </label>
                    <label className="block text-sm text-slate-300">
                        <span className="mb-2 block">Last Name</span>
                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName || ''}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                            required
                        />
                    </label>
                </div>

                <label className="block text-sm text-slate-300">
                    <span className="mb-2 block">Email (login)</span>
                    <input
                        type="email"
                        name="email"
                        value={form.email || ''}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                        required
                    />
                </label>

                <label className="block text-sm text-slate-300">
                    <span className="mb-2 block">Phone Number</span>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone || ''}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                        placeholder="e.g. 08012345678"
                    />
                </label>

                <label className="block text-sm text-slate-300">
                    <span className="mb-2 block">Profile Photo (URL)</span>
                    <input
                        type="url"
                        name="profilePhoto"
                        value={form.profilePhoto || ''}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder-slate-500 focus:border-amber-500"
                        placeholder="https://example.com/photo.jpg"
                    />
                </label>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-xs text-slate-500">
                        You can change your <span className="text-slate-300">role, permissions, and account status</span>
                        only through the school administrator. These fields are protected.
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setForm({
                                firstName: profile.firstName || '',
                                lastName: profile.lastName || '',
                                email: profile.email || '',
                                phone: profile.phone || '',
                                profilePhoto: profile.profilePhoto || '',
                            })
                            setStatus({ type: '', message: '' })
                        }}
                        className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </main>
    )
}
