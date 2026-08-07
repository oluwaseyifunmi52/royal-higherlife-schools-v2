import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile, updateMyProfile } from '../../services/studentService'

export default function StudentProfile() {
    const { user, refreshUser } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [form, setForm] = useState({ phone: '', address: '', parentPhone: '', parentEmail: '' })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyProfile()
                const p = res.data.data
                setProfile(p)
                setForm({
                    phone: p.phone || '',
                    address: p.studentProfile?.address || '',
                    parentPhone: p.studentProfile?.parentPhone || '',
                    parentEmail: p.studentProfile?.parentEmail || '',
                })
            } catch {
                setProfile(user)
            } finally { setLoading(false) }
        }
        fetchProfile()
    }, [user])

    const handleSave = async () => {
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            const res = await updateMyProfile(form)
            setProfile(res.data.data)
            setMessage({ type: 'success', text: 'Profile updated successfully' })
            setEditing(false)
            await refreshUser()
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' })
        } finally { setSaving(false) }
    }

    if (loading) return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-slate-400">Loading profile...</p></main>

    const p = profile || user
    const sp = p?.studentProfile || {}

    return (
        <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-400">Student portal</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Profile</h1>
            </div>

            {message.text && (
                <div className={'mb-6 rounded-2xl border px-4 py-3 text-sm ' + (message.type === 'success' ? 'border-green-500/30 bg-green-500/10 text-green-300' : 'border-red-500/30 bg-red-500/10 text-red-300')}>
                    {message.text}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
                <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 text-center">
                    <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-amber-500/30 bg-slate-800">
                        {p?.profilePhoto ? (
                            <img src={p.profilePhoto} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-amber-400">
                                {(p?.firstName || 'S')[0]}
                            </div>
                        )}
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-white">{p?.name || `${p?.firstName || ''} ${p?.lastName || ''}`}</h2>
                    <p className="text-sm text-amber-400">{sp.admissionNumber || 'No ID'}</p>
                    <p className="text-sm text-slate-400">{p?.email}</p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                            <button onClick={() => setEditing(!editing)} className="text-sm font-semibold text-amber-400 hover:text-amber-300">
                                {editing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-400">Full Name</p>
                                <p className="font-medium text-white">{p?.name || `${p?.firstName || ''} ${p?.lastName || ''}`}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Email</p>
                                <p className="font-medium text-white">{p?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Phone</p>
                                {editing ? (
                                    <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" />
                                ) : (
                                    <p className="font-medium text-white">{p?.phone || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Admission Number</p>
                                <p className="font-medium text-white">{sp.admissionNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Date of Birth</p>
                                <p className="font-medium text-white">{sp.dateOfBirth ? new Date(sp.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Gender</p>
                                <p className="font-medium text-white">{sp.gender || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Class</p>
                                <p className="font-medium text-white">{sp.class || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Session</p>
                                <p className="font-medium text-white">{sp.session || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Address & Guardian</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <p className="text-sm text-slate-400">Address</p>
                                {editing ? (
                                    <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" />
                                ) : (
                                    <p className="font-medium text-white">{sp.address || 'Not set'}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Parent/Guardian Name</p>
                                <p className="font-medium text-white">{sp.parentName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Parent Phone</p>
                                {editing ? (
                                    <input value={form.parentPhone} onChange={(e) => setForm({...form, parentPhone: e.target.value})}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" />
                                ) : (
                                    <p className="font-medium text-white">{sp.parentPhone || 'N/A'}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Parent Email</p>
                                {editing ? (
                                    <input value={form.parentEmail} onChange={(e) => setForm({...form, parentEmail: e.target.value})}
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white text-sm" />
                                ) : (
                                    <p className="font-medium text-white">{sp.parentEmail || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                        {editing && (
                            <button onClick={handleSave} disabled={saving}
                                className="mt-4 rounded-full bg-amber-500 px-6 py-2 font-semibold text-slate-950 text-sm disabled:opacity-50">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>

                    <div className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Read-only Fields</h3>
                        <p className="text-sm text-slate-400 mb-3">These can only be changed by the school administration.</p>
                        <div className="grid gap-3 sm:grid-cols-2 text-sm">
                            <div><span className="text-slate-500">Admission Number: </span><span className="text-slate-300">{sp.admissionNumber || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Class: </span><span className="text-slate-300">{sp.class || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Session: </span><span className="text-slate-300">{sp.session || 'N/A'}</span></div>
                            <div><span className="text-slate-500">Role: </span><span className="text-slate-300">Student</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
